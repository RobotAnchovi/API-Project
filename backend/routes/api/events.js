const express = require("express");
const {
  Group,
  GroupImage,
  User,
  Membership,
  Venue,
  Attendance,
  Event,
  EventImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize, Op } = require("sequelize");

const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

//? Validation middleware for creating an event image
const validateEventImage = [
  check("url").notEmpty().withMessage("Image URL is required."),
  check("preview").isBoolean().withMessage("Preview must be a boolean."),
  handleValidationErrors,
];

//? Validation middleware for editing an event
const validateEventEditing = [
  check("name")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity").isInt().withMessage("Capacity must be an integer"),
  check("price").isFloat({ min: 0 }).withMessage("Price is invalid"),
  check("description").notEmpty().withMessage("Description is required"),
  check("startDate")
    .toDate()
    .isAfter(new Date().toString())
    .withMessage("Start date must be set in the future"),
  check("endDate")
    .toDate()
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
    .withMessage("End date must be after start date"),
  handleValidationErrors,
];

//? Validation middleware for query parameters
const validateQueryParams = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than or equal to 1"),

  check("size")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Size must be greater than or equal to 1"),

  check("name").optional().isString().withMessage("Name must be a string"),

  check("type")
    .optional()
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In Person'"),

  check("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid datetime"),

  handleValidationErrors,
];

//! Get an event (version 1 lazy loading and pagination without all the params)
// router.get("/", validateQueryParams, async (req, res, next) => {
//   let { page = 1, size = 20, name, type, startDate } = req.query;

//   page = isNaN(page) || page <= 0 ? 1 : parseInt(page);
//   size = isNaN(size) || size <= 0 ? 20 : parseInt(size);
//   size = size > 20 ? 20 : size;

//   const where = {};

//   if (name) where.name = { [Op.like]: `%${name}%` };
//   if (type) where.type = type;
//   if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };

//   try {
//     const events = await Event.findAll({
//       where,
//       attributes: {
//         include: [
//           [
//             Sequelize.literal(`(
//                 SELECT COUNT(*)
//                 FROM "meetup_schema_dev_ops"."Attendances" AS attendance
//                 WHERE
//                     attendance."eventId" = Event.id
//             )`),
//             "numAttending",
//           ],
//         ],
//       },
//       limit: size,
//       offset: (page - 1) * size,
//     });

//     // Process each event to add associated data and previewImage
//     const formattedEvents = await Promise.all(
//       events.map(async (event) => {
//         // Lazy load each associated model only when they are accessed
//         const group = await event.getGroup({
//           attributes: ["id", "name", "city", "state"],
//         });
//         const venue = await event.getVenue({
//           attributes: ["id", "city", "state"],
//         });
//         const eventImages = await event.getEventImages();

//         let previewImage = "No preview image found.";
//         if (Array.isArray(eventImages)) {
//           eventImages.forEach((image) => {
//             if (image.preview === true) {
//               previewImage = image.url;
//             }
//           });
//         }

//         return {
//           id: event.id,
//           groupId: event.groupId,
//           venueId: event.venueId,
//           name: event.name,
//           type: event.type,
//           startDate: event.startDate,
//           endDate: event.endDate,
//           numAttending: event.dataValues.numAttending,
//           previewImage,
//           Group: group,
//           Venue: venue,
//         };
//       })
//     );

//     res.status(200).json({ Events: formattedEvents });
//   } catch (err) {
//     next(err);
//   }
// });

//~ Get an event (version 2 eager loading and pagination without all the params)
router.get("/", validateQueryParams, async (req, res, next) => {
  let { page = 1, size = 20, name, type, startDate } = req.query;
  page = isNaN(page) || page <= 0 ? 1 : parseInt(page);
  size = isNaN(size) || size <= 0 ? 20 : parseInt(size);
  size = size > 20 ? 20 : size;

  const where = {};

  if (name) where.name = { [Op.like]: `%${name}%` };
  if (type) where.type = type;
  if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };

  try {
    const events = await Event.findAll({
      where,
      limit: size,
      offset: (page - 1) * size,
    });

    const formattedEvents = await Promise.all(
      events.map(async (event) => {
        const group = await event.getGroup({
          attributes: ["id", "name", "city", "state"],
        });
        const venue = await event.getVenue({
          attributes: ["id", "city", "state"],
        });
        const eventImages = await event.getEventImages();

        const attendanceCount = await Attendance.count({
          where: { eventId: event.id },
        });

        let previewImage = "No preview image found.";
        if (Array.isArray(eventImages)) {
          const preview = eventImages.find((image) => image.preview === true);
          if (preview) {
            previewImage = preview.url;
          }
        }
        return {
          id: event.id,
          groupId: event.groupId,
          venueId: event.venueId,
          name: event.name,
          type: event.type,
          startDate: event.startDate,
          endDate: event.endDate,
          numAttending: attendanceCount,
          previewImage,
          Group: group,
          Venue: venue,
        };
      })
    );
    res.status(200).json({ Events: formattedEvents });
  } catch (err) {
    next(err);
  }
});

//~ Get all events (version two eager loading and pagination)
router.get("/", async (req, res, next) => {
  let { page = 1, size = 20, name, type, startDate } = req.query;

  page = isNaN(page) || page <= 0 ? 1 : parseInt(page);
  size = isNaN(size) || size <= 0 ? 20 : parseInt(size);
  size = size > 20 ? 20 : size;

  const where = {};

  if (name) where.name = { [Op.like]: `%${name}%` };
  if (type) where.type = type;
  if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };

  try {
    const events = await Event.findAll({
      where,
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          as: "venue",
          attributes: ["id", "city", "state"],
        },
      ],
      limit: size,
      offset: (page - 1) * size,
    });
    for (const event of events) {
      const count = await Attendance.count({
        where: { eventId: event.id },
      });
      event.setDataValue("numAttending", count);
    }

    const formattedEvents = events.map((event) => {
      return {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: event.dataValues.numAttending,
        previewImage: event.previewImage,
        Group: event.group,
        Venue: event.venue,
      };
    });

    res.status(200).json({ Events: formattedEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const ownedEvents = await Event.findAll({
    include: [
      {
        model: Group,
        as: "group",
        where: {
          organizerId: user.id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: EventImage,
        as: "eventImages",
        attributes: {
          exclude: ["eventId", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  const attendingEvents = await Event.findAll({
    include: [
      {
        model: User,
        as: "numAttending",
        where: {
          id: user.id,
        },
      },
      {
        model: Group,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: EventImage,
        attributes: {
          exclude: ["eventId", "createdAt", "updatedAt"],
        },
      },
    ],
  });
  return res.json({
    ownedEvents,
    attendingEvents,
  });
});

//~ Add an image to an event
router.post(
  "/:eventId/images",
  requireAuth,
  validateEventImage,
  async (req, res, next) => {
    const eventId = parseInt(req.params.eventId, 10);
    const { url, preview } = req.body;
    const userId = req.user.id;

    try {
      const event = await Event.findByPk(eventId, {
        include: { model: Group, as: "group" },
      });
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const groupId = event.group.id;

      const attendance = await Attendance.findOne({
        where: { eventId, userId, status: "attending" },
      });

      const membership = await Membership.findOne({
        where: { groupId, userId, status: ["co-host"] },
      });

      const isOrganizer = event.group.organizerId === userId;

      if (!attendance && !membership && !isOrganizer) {
        return res.status(403).json({
          message: "You must be an attendee, host, or co-host to add images.",
        });
      }

      const image = await EventImage.create({ eventId, url, preview });

      res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview,
      });
    } catch (err) {
      next(err);
    }
  }
);

//~ Get an event by its id
router.get("/:eventId", async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);

  try {
    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "private", "city", "state"],
        },
        {
          model: Venue,
          as: "venue",
          attributes: ["id", "address", "city", "state", "lat", "lng"],
        },
        {
          model: EventImage,
          as: "eventImages",
          attributes: ["id", "url", "preview"],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const numAttending = await Attendance.count({
      where: { eventId: event.id },
    });

    const eventData = event.get({ plain: true });
    const { createdAt, updatedAt, group, venue, eventImages, ...rest } =
      eventData;

    //^ Parse lat and lng to numbers
    if (eventData.venue) {
      venue.lat = parseFloat(venue.lat);
      venue.lng = parseFloat(venue.lng);
    }

    const eventDetails = {
      ...rest,
      Group: group,
      Venue: venue,
      EventImages: eventImages,
      numAttending: numAttending,
    };

    return res.status(200).json(eventDetails);
  } catch (error) {
    next(error);
  }
});

//~ Edit an event
router.put(
  "/:eventId",
  requireAuth,
  validateEventEditing,
  async (req, res, next) => {
    const eventId = parseInt(req.params.eventId, 10);
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;
    const userId = req.user.id;

    //^ Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Bad Request", errors: errors.array() });
    }

    try {
      //^ Find the event and its related group
      const event = await Event.findByPk(eventId, {
        include: { model: Group, as: "group" },
      });
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const groupId = event.group.id;
      const group = await Group.findByPk(groupId);

      //^ Authorization check: current user must be the organizer of the group or a co-host
      const isOrganizer = group && group.organizerId === userId;
      const membership = await Membership.findOne({
        where: { groupId, userId, status: "co-host" },
      });
      if (!isOrganizer && !membership) {
        return res.status(403).json({
          message: "You must be the organizer or a co-host to edit the event.",
        });
      }

      //^ Check if the venue exists if venueId is provided
      if (venueId) {
        const venue = await Venue.findByPk(venueId);
        if (!venue) {
          return res.status(404).json({ message: "Venue couldn't be found" });
        }
      }

      await event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });

      const responseEvent = {
        id: event.id,
        venueId: event.venueId,
        groupId: event.groupId,
        name: event.name,
        description: event.description,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        startDate: event.startDate,
        endDate: event.endDate,
      };

      res.status(200).json(responseEvent);
    } catch (err) {
      next(err);
    }
  }
);

//~ Delete an event
router.delete("/:eventId", requireAuth, async (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  const userId = req.user.id;

  try {
    //^ Find the event and its related group
    const event = await Event.findByPk(eventId, {
      include: { model: Group, as: "group" },
    });
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const groupId = event.group.id;
    const group = await Group.findByPk(groupId);

    //^ Authorization check: current user must be the organizer of the group or a co-host
    const isOrganizer = group && group.organizerId === userId;
    const membership = await Membership.findOne({
      where: { groupId, userId, status: "co-host" },
    });
    if (!isOrganizer && !membership) {
      return res.status(403).json({
        message: "You must be the organizer or a co-host to delete the event.",
      });
    }

    //^ Delete the event
    await event.destroy();

    //^ Respond with confirmation message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

//~ Get all Attendees of an Event specified by its id
// router.get("/:eventId/attendees", async (req, res, next) => {
//   try {
//     const eventId = parseInt(req.params.eventId, 10);
//     if (isNaN(eventId)) {
//       return res.status(400).json({ message: "Invalid event ID" });
//     }

//     //^ Fetch the event with corrected alias
//     const event = await Event.findByPk(eventId, {
//       include: [
//         {
//           model: Attendance,
//           as: "attendances",
//           include: [
//             {
//               model: User,
//               as: "user",
//               attributes: ["id", "firstName", "lastName"],
//             },
//           ],
//         },
//       ],
//     });

//     if (!event) {
//       return res.status(404).json({ message: "Event couldn't be found" });
//     }

//     //^ Ensure attendances data exists before tryna map it
//     const attendees = event.attendances
//       ? event.attendances.map((att) => {
//           const { id, firstName, lastName } = att.user;
//           return {
//             id,
//             firstName,
//             lastName,
//             Attendance: {
//               status: att.status,
//             },
//           };
//         })
//       : [];

//     res.status(200).json({ Attendees: attendees });
//   } catch (err) {
//     next(err);
//   }
// });
//~ Version 2

router.get("/:eventId/attendees", requireAuth, async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = req.user.id;

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Group,
          as: "group",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    // Check if the user is the organizer or a co-host of the group
    const group = await Group.findByPk(event.groupId);
    let isAuthorized = false;

    if (group.organizerId === userId) {
      isAuthorized = true;
    } else {
      const coHost = await Membership.findOne({
        where: { groupId: event.groupId, userId: userId, status: "co-host" },
      });
      if (coHost) isAuthorized = true;
    }

    const attendees = await Attendance.findAll({
      where: {
        eventId: eventId,

        ...(isAuthorized ? {} : { status: "attending" }),
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    const attendeeData = attendees.map((att) => {
      const { id, firstName, lastName } = att.user;
      return {
        id,
        firstName,
        lastName,
        Attendance: {
          status: att.status,
        },
      };
    });

    res.status(200).json({ Attendees: attendeeData });
  } catch (err) {
    next(err);
  }
});
//~ Request to Attend an Event based on the Event's id
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const userId = req.user.id;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const membership = await Membership.findOne({
      where: { groupId: event.groupId, userId: userId },
    });
    if (!membership || membership.status === "pending") {
      return res.status(403).json({
        message: "You must be a member of the group to request attendance",
      });
    }

    const existingAttendance = await Attendance.findOne({
      where: { eventId: eventId, userId: userId },
    });
    if (existingAttendance) {
      if (existingAttendance.status === "pending") {
        return res
          .status(400)
          .json({ message: "Attendance has already been requested" });
      }
      return res
        .status(400)
        .json({ message: "User is already an attendee of the event" });
    }

    const newAttendance = await Attendance.create({
      eventId: eventId,
      userId: userId,
      status: "pending",
    });

    res.status(200).json({
      userId: newAttendance.userId,
      status: newAttendance.status,
    });
  } catch (err) {
    next(err);
  }
});

//~ Change the status of an attendance for an event specified by id
router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const { userId, status } = req.body;
    const currentUserId = req.user.id;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User couldn't be found" });
    }

    const group = await Group.findByPk(event.groupId);
    const isOrganizer = group && group.organizerId === currentUserId;
    const isCoHost = await Membership.findOne({
      where: { userId: currentUserId, groupId: group.id, status: "co-host" },
    });

    if (!isOrganizer && !isCoHost) {
      return res.status(403).json({
        message:
          "You must be the organizer or a co-host to change attendance status.",
      });
    }

    if (status === "pending") {
      return res
        .status(400)
        .json({ message: "Cannot change an attendance status to pending" });
    }

    const attendance = await Attendance.findOne({
      where: { eventId: eventId, userId: userId },
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance between the user and the event does not exist",
      });
    }

    await attendance.update({ status });

    res.status(200).json({
      id: attendance.id,
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status,
    });
  } catch (err) {
    next(err);
  }
});

//~ Delete an Event specified by its ID
router.delete(
  "/:eventId/attendance/:userId",
  requireAuth,
  async (req, res, next) => {
    try {
      const eventId = parseInt(req.params.eventId, 10);
      const targetUserId = parseInt(req.params.userId, 10);
      const currentUserId = req.user.id;

      //^ Check if event exists
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      //^ Check if the user to be deleted exists
      const user = await User.findByPk(targetUserId);
      if (!user) {
        return res.status(404).json({ message: "User couldn't be found" });
      }

      //^ Authorization check: current user must be the organizer or the target user
      const group = await Group.findByPk(event.groupId);
      const isOrganizer = group && group.organizerId === currentUserId;
      if (!isOrganizer && currentUserId !== targetUserId) {
        return res
          .status(403)
          .json({ message: "Insufficient permissions to delete attendance" });
      }

      //^ Find and delete the attendance
      const attendance = await Attendance.findOne({
        where: { eventId: eventId, userId: targetUserId },
      });

      if (!attendance) {
        return res
          .status(404)
          .json({ message: "Attendance does not exist for this User" });
      }

      await attendance.destroy();

      res
        .status(200)
        .json({ message: "Successfully deleted attendance from event" });
    } catch (err) {
      next(err);
    }
  }
);

//! router.get('/', async (req, res, next) => {
//     try {
//         // Default values
//         const page = parseInt(req.query.page) || 1;
//         const size = parseInt(req.query.size) || 20;
//         const { name, type, startDate } = req.query;

//         // Validation for page and size
//         if (page < 1 || size < 1) {
//             return res.status(400).json({
//                 message: "Bad Request",
//                 errors: {
//                     page: "Page must be greater than or equal to 1",
//                     size: "Size must be greater than or equal to 1",
//                 }
//             });
//         }

//         // Constructing the where clause for filtering
//         const where = {};
//         if (name) where.name = { [Op.like]: `%${name}%` };
//         if (type) where.type = type;
//         if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };

//         // Include necessary models and calculate offset
//         const include = [{ model: Group, as: 'Group' }, { model: Venue, as: 'Venue' }];
//         const offset = (page - 1) * size;

//         // Query the database
//         const events = await Event.findAll({
//             where,
//             include,
//             limit: size,
//             offset,
//         });

//         // Format the results to match the desired output
//         const results = events.map(event => ({
//             numAttending: event.Attendances.length,
//             previewImage: event.previewImage,
//             Group: {
//                 id: event.Group.id,
//                 name: event.Group.name,
//                 city: event.Group.city,
//                 state: event.Group.state,
//             },
//             Venue: event.Venue && {
//                 id: event.Venue.id,
//                 city: event.Venue.city,
//                 state: event.Venue.state,
//             },
//             // Add other necessary event fields
//         }));

//         res.status(200).json({ Events: results });
//     } catch (err) {
//         next(err);
//     }
// });

router.get("/", async (req, res, next) => {
  let { page = 1, size = 20, name, type, startDate } = req.query;

  //^ Validate and setup for pagination
  page = isNaN(page) || page < 1 ? 1 : parseInt(page);
  size = isNaN(size) || size < 1 ? 20 : parseInt(size);
  size = size > 20 ? 20 : size; // Ensuring size does not exceed 20

  const where = {};

  // Constructing the where clause for filtering
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (type) where.type = type;
  if (startDate) where.startDate = { [Op.gte]: new Date(startDate) };

  try {
    // Fetch events with pagination and filters applied
    const events = await Event.findAll({
      where,
      include: [
        {
          model: Group,
          as: "Group",
          attributes: ["id", "name", "city", "state"],
        },
        {
          model: Venue,
          as: "Venue",
          attributes: ["id", "city", "state"],
        },
      ],
      limit: size,
      offset: (page - 1) * size,
    });

    // Construct and send response
    const responseEvents = events.map((event) => {
      return {
        id: event.id,
        groupId: event.GroupId,
        venueId: event.VenueId,
        name: event.name,
        type: event.type,
        startDate: event.startDate,
        endDate: event.endDate,

        previewImage: event.previewImage,
        Group: event.Group,
        Venue: event.Venue,
      };
    });

    res.status(200).json({ Events: responseEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
