# MutantMerge

## Introduction

MutantMerge is a full-stack, work-in-progress clone of Meetup, showcasing CRUD (Create, Read, Update, Delete) capabilities across various features. This project demonstrates a comprehensive understanding of both frontend and backend technologies, making it an ideal portfolio piece for potential employers.

## Technologies Used

### Backend

- **Express**: A minimal and flexible Node.js web application framework.
- **Express-Validator**: Middleware for validating and sanitizing requests.
- **Sequelize**: A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **JWT (JSON Web Tokens)**: For securely transmitting information between parties as a JSON object.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **React Router**: A standard library for routing in React.
- **Redux**: A Predictable State Container for JS Apps.
- **CSS**: For styling.
- **Font Awesome**: For icons.
- **Google Fonts**: For web typography.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm installed on your machine.

### To Launch

1. **Set Up the Backend**

   - Navigate to the backend directory.
   - Create a `.env` file and initialize the following variables:
     ```
     PORT=8000
     DB_FILE=db/dev.db
     JWT_SECRET=<Your secret here>
     JWT_EXPIRES_IN=604800
     ```
   - Run `npm install` to install dependencies.
   - Run `npm run dbreset` to create and seed the database.
   - Run `npm start` to start the backend server.

2. **Set Up the Frontend**
   - Navigate to the frontend directory.
   - Run `npm install` to install dependencies.
   - Run `npm run dev` to start the frontend server.
   - Press "o" in the terminal running the server to open the rendered webpage.

## Contributing

MutantMerge is currently a personal portfolio project, and contributions are not being accepted at this time. However, any feedback or suggestions are welcome!

---

MutantMerge is not affiliated with or endorsed by Meetup.

## Database Schema Design

![meetup-database-schema]

[meetup-database-schema]: https://appacademy-open-assets.s3.us-west-1.amazonaws.com/Modular-Curriculum/content/week-12/meetup-db-schema.png
[meetup-db-diagram-info]: https://appacademy-open-assets.s3.us-west-1.amazonaws.com/Modular-Curriculum/content/week-12/meetup-db-diagram-info.txt

## API Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/session
  - Body: none

- Successful Response when there is a logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Successful Response when there is no logged in user

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- Error response: User already exists with the specified email

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists"
      }
    }
    ```

- Error response: User already exists with the specified username

  - Status Code: 500
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## GROUPS

### Get all Groups

Returns all the groups.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/groups
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Groups": [
        {
          "id": 1,
          "organizerId": 1,
          "name": "Evening Tennis on the Water",
          "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          "type": "In person",
          "private": true,
          "city": "New York",
          "state": "NY",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "numMembers": 10,
          "previewImage": "image url"
        }
      ]
    }
    ```

### Get all Groups joined or organized by the Current User

Returns all the groups.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/groups/current
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Groups": [
        {
          "id": 1,
          "organizerId": 1,
          "name": "Evening Tennis on the Water",
          "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
          "type": "In person",
          "private": true,
          "city": "New York",
          "state": "NY",
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
          "numMembers": 10,
          "previewImage": "image url"
        }
      ]
    }
    ```

### Get details of a Group from an id

Returns the details of a group specified by its id.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/groups/:groupId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "organizerId": 1,
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "numMembers": 10,
      "GroupImages": [
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image url",
          "preview": false
        }
      ],
      "Organizer": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith"
      },
      "Venues": [
        {
          "id": 1,
          "groupId": 1,
          "address": "123 Disney Lane",
          "city": "New York",
          "state": "NY",
          "lat": 37.7645358,
          "lng": -122.4730327
        }
      ]
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Create a Group

Creates and returns a new group.

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/groups
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY"
    }
    ```

- Successful Response

  - Status Code: 201
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "organizerId": 1,
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be 60 characters or less",
        "about": "About must be 50 characters or more",
        "type": "Type must be 'Online' or 'In person'",
        "private": "Private must be a boolean",
        "city": "City is required",
        "state": "State is required"
      }
    }
    ```

### Add an Image to a Group based on the Group's id

Create and return a new image for a group specified by id.

- Require Authentication: true
- Require proper authorization: Current User must be the organizer for the group
- Request

  - Method: POST
  - URL: /api/groups/:groupId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url",
      "preview": true
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url",
      "preview": true
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Edit a Group

Updates and returns an existing group.

- Require Authentication: true
- Require proper authorization: Group must belong to the current user
- Request

  - Method: PUT
  - URL: /api/groups/:groupId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "organizerId": 1,
      "name": "Evening Tennis on the Water",
      "about": "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      "type": "In person",
      "private": true,
      "city": "New York",
      "state": "NY",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 10:06:40"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be 60 characters or less",
        "about": "About must be 50 characters or more",
        "type": "Type must be 'Online' or 'In person'",
        "private": "Private must be a boolean",
        "city": "City is required",
        "state": "State is required"
      }
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Delete a Group

Deletes an existing group.

- Require Authentication: true
- Require proper authorization: Group must belong to the current user
- Request

  - Method: DELETE
  - URL: /api/groups/:groupId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

## VENUES

### Get All Venues for a Group specified by its id

Returns all venues for a group specified by its id

- Require Authentication: true
- Require Authentication: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: GET
  - URL: /api/groups/:groupId/venues
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "Venues": [
      {
        "id": 1,
        "groupId": 1,
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327
      }
    ]
  }
  ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Create a new Venue for a Group specified by its id

Creates and returns a new venue for a group specified by its id

- Require Authentication: true
- Require Authentication: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: POST
  - URL: /api/groups/:groupId/venues
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "address": "123 Disney Lane",
    "city": "New York",
    "state": "NY",
    "lat": 37.7645358,
    "lng": -122.4730327
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "id": 1,
    "groupId": 1,
    "address": "123 Disney Lane",
    "city": "New York",
    "state": "NY",
    "lat": 37.7645358,
    "lng": -122.4730327
  }
  ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "address": "Street address is required",
        "city": "City is required",
        "state": "State is required",
        "lat": "Latitude must be within -90 and 90",
        "lng": "Longitude must be within -180 and 180"
      }
    }
    ```

### Edit a Venue specified by its id

Edit a new venue specified by its id

- Require Authentication: true
- Require Authentication: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: PUT
  - URL: /api/venues/:venueId
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "address": "123 Disney Lane",
    "city": "New York",
    "state": "NY",
    "lat": 37.7645358,
    "lng": -122.4730327
  }
  ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

  ```json
  {
    "id": 1,
    "groupId": 1,
    "address": "123 Disney Lane",
    "city": "New York",
    "state": "NY",
    "lat": 37.7645358,
    "lng": -122.4730327
  }
  ```

- Error response: Couldn't find a Venue with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Venue couldn't be found"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "address": "Street address is required",
        "city": "City is required",
        "state": "State is required",
        "lat": "Latitude must be within -90 and 90",
        "lng": "Longitude must be within -180 and 180"
      }
    }
    ```

## EVENTS

### Get all Events

Returns all the events.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/events
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Events": [
        {
          "id": 1,
          "groupId": 1,
          "venueId": null,
          "name": "Tennis Group First Meet and Greet",
          "type": "Online",
          "startDate": "2021-11-19 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 8,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": null
        },
        {
          "id": 1,
          "groupId": 1,
          "venueId": 1,
          "name": "Tennis Singles",
          "type": "In Person",
          "startDate": "2021-11-20 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 4,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": {
            "id": 1,
            "city": "New York",
            "state": "NY"
          }
        }
      ]
    }
    ```

### Get all Events of a Group specified by its id

Returns all the events of a group specified by its id

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/groups/:groupId/events
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Events": [
        {
          "id": 1,
          "groupId": 1,
          "venueId": null,
          "name": "Tennis Group First Meet and Greet",
          "type": "Online",
          "startDate": "2021-11-19 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 8,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": null
        },
        {
          "id": 1,
          "groupId": 1,
          "venueId": 1,
          "name": "Tennis Singles",
          "type": "In Person",
          "startDate": "2021-11-20 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 4,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": {
            "id": 1,
            "city": "New York",
            "state": "NY"
          }
        }
      ]
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Get details of an Event specified by its id

Returns the details of an event specified by its id.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/events/:eventId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "groupId": 1,
      "venueId": 1,
      "name": "Tennis Group First Meet and Greet",
      "description": "First meet and greet event for the evening tennis on the water group! Join us online for happy times!",
      "type": "Online",
      "capacity": 10,
      "price": 18.5,
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00",
      "numAttending": 8,
      "Group": {
        "id": 1,
        "name": "Evening Tennis on the Water",
        "private": true,
        "city": "New York",
        "state": "NY"
      },
      "Venue": {
        "id": 1,
        "address": "123 Disney Lane",
        "city": "New York",
        "state": "NY",
        "lat": 37.7645358,
        "lng": -122.4730327
      },
      "EventImages": [
        {
          "id": 1,
          "url": "image url",
          "preview": true
        },
        {
          "id": 2,
          "url": "image url",
          "preview": false
        }
      ]
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

### Create an Event for a Group specified by its id

Creates and returns a new event for a group specified by its id

- Require Authentication: true
- Require Authorization: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: POST
  - URL: /api/groups/:groupId/events
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "venueId": 1,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.5,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "groupId": 1,
      "venueId": 1,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.5,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be at least 5 characters",
        "type": "Type must be Online or In person",
        "capacity": "Capacity must be an integer",
        "price": "Price is invalid",
        "description": "Description is required",
        "startDate": "Start date must be in the future",
        "endDate": "End date is less than start date"
      }
    }
    ```

- Error response: Couldn't find a Venue with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Venue couldn't be found"
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Add an Image to an Event based on the Event's id

Create and return a new image for an event specified by id.

- Require Authentication: true
- Require proper authorization: Current User must be an attendee, host, or co-host of the event
- Request

  - Method: POST
  - URL: /api/events/:eventId/images
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "url": "image url",
      "preview": false
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "url": "image url",
      "preview": false
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

### Edit an Event specified by its id

Edit and returns an event specified by its id

- Require Authentication: true
- Require Authorization: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: PUT
  - URL: /api/events/:eventId
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "venueId": 1,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.5,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "groupId": 1,
      "venueId": 1,
      "name": "Tennis Group First Meet and Greet",
      "type": "Online",
      "capacity": 10,
      "price": 18.5,
      "description": "The first meet and greet for our group! Come say hello!",
      "startDate": "2021-11-19 20:00:00",
      "endDate": "2021-11-19 22:00:00"
    }
    ```

- Error Response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be at least 5 characters",
        "type": "Type must be Online or In person",
        "capacity": "Capacity must be an integer",
        "price": "Price is invalid",
        "description": "Description is required",
        "startDate": "Start date must be in the future",
        "endDate": "End date is less than start date"
      }
    }
    ```

- Error response: Couldn't find a Venue with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Venue couldn't be found"
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

### Delete an Event specified by its id

Delete an event specified by its id

- Require Authentication: true
- Require Authorization: Current User must be the organizer of the group or a member of
  the group with a status of "co-host"
- Request

  - Method: DELETE
  - URL: /api/events/:eventId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

## MEMBERSHIPS

### Get all Members of a Group specified by its id

Returns the members of a group specified by its id.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/groups/:groupId/members
  - Body: none

- Successful Response: If you ARE the organizer or a co-host of the group. Shows
  all members and their statuses.

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Members": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "Membership": {
            "status": "co-host"
          }
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "Membership": {
            "status": "member"
          }
        },
        {
          "id": 4,
          "firstName": "Jane",
          "lastName": "Doe",
          "Membership": {
            "status": "pending"
          }
        }
      ]
    }
    ```

- Successful Response: If you ARE NOT the organizer of the group. Shows only
  members that don't have a status of "pending".

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Members": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "Membership": {
            "status": "co-host"
          }
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "Membership": {
            "status": "member"
          }
        }
      ]
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

### Request a Membership for a Group based on the Group's id

Request a new membership for a group specified by id.

- Require Authentication: true
- Request

  - Method: POST
  - URL: /api/groups/:groupId/membership
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "memberId": 2,
      "status": "pending"
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

- Error response: Current User already has a pending membership
  for the group

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Membership has already been requested"
    }
    ```

- Error response: Current User is already an accepted member of the group

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User is already a member of the group"
    }
    ```

### Change the status of a membership for a group specified by id

Change the status of a membership for a group specified by id.

- Require Authentication: true
- Require proper authorization:
  - To change the status from "pending" to "member":
    - Current User must already be the organizer or have a membership to the
      group with the status of "co-host"
  - To change the status from "member" to "co-host":
    - Current User must already be the organizer
- Request

  - Method: PUT
  - URL: /api/groups/:groupId/membership
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "memberId": 2,
      "status": "member"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "groupId": 1,
      "memberId": 2,
      "status": "member"
    }
    ```

- Error response: If changing the membership status to "pending".

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "status": "Cannot change a membership status to pending"
      }
    }
    ```

- Error response: Couldn't find a User with the specified memberId

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

- Error response: If membership does not exist

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Membership between the user and the group does not exist"
    }
    ```

### Delete membership to a group specified by id

Delete a membership to a group specified by id.

- Require Authentication: true
- Require proper authorization: Current User must be the host of the group, or
  the user whose membership is being deleted
- Request

  - Method: DELETE
  - URL: /api/groups/:groupId/membership/:memberId
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted membership from group"
    }
    ```

- Error response: Couldn't find a User with the specified memberId

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

- Error response: Couldn't find a Group with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group couldn't be found"
    }
    ```

- Error response: Membership does not exist for this User

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Membership does not exist for this User"
    }
    ```

## ATTENDEES

### Get all Attendees of an Event specified by its id

Returns the attendees of an event specified by its id.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/events/:eventId/attendees
  - Body: none

- Successful Response: If you ARE the organizer of the group or a member of the
  group with a status of "co-host". Shows all attendees including those with a
  status of "pending".

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Attendees": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "Attendance": {
            "status": "attending"
          }
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "Attendance": {
            "status": "waitlist"
          }
        },
        {
          "id": 4,
          "firstName": "Jane",
          "lastName": "Doe",
          "Attendance": {
            "status": "pending"
          }
        }
      ]
    }
    ```

- Successful Response: If you ARE NOT the organizer of the group or a member of
  the group with a status of "co-host". Shows all members that don't have a
  status of "pending".

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Attendees": [
        {
          "id": 2,
          "firstName": "Clark",
          "lastName": "Adams",
          "Attendance": {
            "status": "attending"
          }
        },
        {
          "id": 3,
          "firstName": "John",
          "lastName": "Smith",
          "Attendance": {
            "status": "waitlist"
          }
        }
      ]
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

### Request to Attend an Event based on the Event's id

Request attendance for an event specified by id.

- Require Authentication: true
- Require Authorization: Current User must be a member of the group
- Request

  - Method: POST
  - URL: /api/events/:eventId/attendance
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "userId": 2,
      "status": "pending"
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

- Error response: Current User already has a pending attendance
  for the event

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Attendance has already been requested"
    }
    ```

- Error response: Current User is already an accepted attendee of the event

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User is already an attendee of the event"
    }
    ```

### Change the status of an attendance for an event specified by id

Change the status of an attendance for an event specified by id.

- Require Authentication: true
- Require proper authorization: Current User must already be the organizer or
  have a membership to the group with the status of "co-host"
- Request

  - Method: PUT
  - URL: /api/events/:eventId/attendance
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "userId": 2,
      "status": "attending"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "eventId": 1,
      "userId": 2,
      "status": "attending"
    }
    ```

- Error response: Couldn't find a User with the specified userId

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

- Error response: If changing the attendance status to "pending".

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "status": "Cannot change an attendance status to pending"
      }
    }
    ```

- Error response: If attendance does not exist

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Attendance between the user and the event does not exist"
    }
    ```

### Delete attendance to an event specified by id

Delete an attendance to an event specified by id.

- Require Authentication: true
- Require proper authorization: Current User must be the host of the group, or
  the user whose attendance is being deleted
- Request

  - Method: DELETE
  - URL: /api/events/:eventId/attendance/:userId
  - Headers:
    - Content-Type: application/json
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted attendance from event"
    }
    ```

- Error response: Couldn't find a User with the specified userId

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User couldn't be found"
    }
    ```

- Error response: Couldn't find an Event with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event couldn't be found"
    }
    ```

- Error response: Attendance does not exist for this User

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Attendance does not exist for this User"
    }
    ```

## IMAGES

### Delete an Image for a Group

Delete an existing image for a Group.

- Require Authentication: true
- Require proper authorization: Current user must be the organizer or "co-host"
  of the Group
- Request

  - Method: DELETE
  - URL: /api/group-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find an Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Group Image couldn't be found"
    }
    ```

### Delete an Image for an Event

Delete an existing image for an Event.

- Require Authentication: true
- Require proper authorization: Current user must be the organizer or "co-host"
  of the Group that the Event belongs to
- Request

  - Method: DELETE
  - URL: /api/event-images/:imageId
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- Error response: Couldn't find an Image with the specified id

  - Status Code: 404
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Event Image couldn't be found"
    }
    ```

### Add Query Filters to Get All Events

Return events filtered by query parameters.

- Require Authentication: false
- Request

  - Method: GET
  - URL: /api/events
  - Query Parameters
    - page: integer, minimum: 1, maximum: 10, default: 1
    - size: integer, minimum: 1, maximum: 20, default: 20
    - name: string, optional
    - type: string, optional
    - startDate: string, optional
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "Events": [
        {
          "id": 1,
          "groupId": 1,
          "venueId": null,
          "name": "Tennis Group First Meet and Greet",
          "type": "Online",
          "startDate": "2021-11-19 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 8,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": null
        },
        {
          "id": 1,
          "groupId": 1,
          "venueId": 1,
          "name": "Tennis Singles",
          "type": "In Person",
          "startDate": "2021-11-20 20:00:00",
          "endDate": "2021-11-19 22:00:00",
          "numAttending": 4,
          "previewImage": "image url",
          "Group": {
            "id": 1,
            "name": "Evening Tennis on the Water",
            "city": "New York",
            "state": "NY"
          },
          "Venue": {
            "id": 1,
            "city": "New York",
            "state": "NY"
          }
        }
      ]
    }
    ```

- Error Response: Query parameter validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be greater than or equal to 1",
        "name": "Name must be a string",
        "type": "Type must be 'Online' or 'In Person'",
        "startDate": "Start date must be a valid datetime"
      }
    }
    ```
