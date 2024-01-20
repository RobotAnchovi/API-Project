import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkCreateGroup, thunkAddImage } from "../../../store/groups";
import "./CreateGroup.css";

const CreateGroup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("placeholder");
  const [privacy, setPrivacy] = useState("placeholder");
  const [imageUrl, setImageUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    const urlEndings = [".png", ".jpg", ".jpeg"];
    const urlEnding3 = imageUrl.slice(-4);
    const urlEnding4 = imageUrl.slice(-5);

    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (state.length < 2 || state.length > 2)
      errors.state = "State must be formatted as a two-letter abbreviation";
    if (!name)
      errors.name =
        "Your true identity is required, but trust we will tell no one.";
    if (about.length < 30)
      errors.about =
        "Description must be at least 30 characters long. Unless your tentacles prohibit this.";
    if (type == "placeholder" || !type)
      errors.type = "Faction Type is required";
    if (privacy == "placeholder" || !privacy)
      errors.privacy = "Visibility Type is required even if you are invisible";
    if (!urlEndings.includes(urlEnding3) && !urlEndings.includes(urlEnding4))
      errors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg";

    if (Object.values(errors).length) {
      setValidationErrors(errors);
    } else {
      const newGroupReqBody = {
        name,
        about,
        type,
        private: privacy,
        city,
        state: state.toUpperCase(),
      };

      const newImageReqBody = {
        url: imageUrl,
        preview: true,
      };

      const createdGroup = await dispatch(thunkCreateGroup(newGroupReqBody));

      if (createdGroup.errors) {
        // console.log("createdGroup.errors:", createdGroup.errors)
        // set validation errors
      } else {
        // dispatch the image to the new group's id
        // the dispatch needs the group id AND the body
        await dispatch(thunkAddImage(createdGroup.id, newImageReqBody));
        navigate(`/groups/${createdGroup.id}`);
      }
    }
  };

  return (
    <section className="group-section">
      <h4>ORGANIZE YOUR OWN FACTION</h4>
      <h2>Start a New faction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Declare your faction&apos;s secret location</h2>
          <p>
            MutantMingle factions gather locally, in person and online.
            <br />
            We&apos;ll connect you with mutants, heroes, or villains in your
            area.
          </p>
          <label htmlFor="city">
            <input
              type="text"
              name="city"
              id="group-city"
              placeholder="City of Origin"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <span id="comma-span">,</span>
          <label htmlFor="state">
            <input
              type="text"
              id="group-state"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          <div className="errors-div">
            {"city" in validationErrors && (
              <span className="errors" id="group-error-city">
                {validationErrors.city}
              </span>
            )}
            {"state" in validationErrors && (
              <span className="errors" id="group-error-state">
                {validationErrors.state}
              </span>
            )}
          </div>
        </div>
        <div>
          <h2>What shall we call your faction?</h2>
          <p>
            Choose a name that will provide hope or strike fear in the hearts of
            your enemies.
            <br />
            Waste little time! Evil runs rampant in the streets.You can always
            change it later.
          </p>
          <label>
            <input
              type="text"
              id="group-name"
              placeholder="Your faction shall be called..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div className="errors-div">
            {"name" in validationErrors && (
              <span className="errors">{validationErrors.name}</span>
            )}
          </div>
        </div>
        <div>
          <h2>Proclaim the purpose of your faction!</h2>
          <label>
            <p>
              This will be made public to all! Should your purpose change or
              evil forces prevail, you can always change it later.
              <br />
              <br />
              1. What&apos;s the purpose or destiny of the faction?
              <br />
              2. Who should align themselves with your faction?
              <br />
              3. What type of events will your faction pursue?
            </p>
          </label>
          <textarea
            name=""
            id="group-about"
            cols="30"
            rows="10"
            placeholder="State your purpose with at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          <div className="errors-div">
            {"about" in validationErrors && (
              <span className="errors">{validationErrors.about}</span>
            )}
          </div>
        </div>
        <div id="final-steps-div">
          <h2>Almost complete...</h2>
          <label htmlFor="type">
            <p>Does your faction meet in person or online?</p>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option
                className="placeholder-select"
                disabled
                value="placeholder"
              >
                (select one)
              </option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </label>
          <div className="errors-div">
            {"type" in validationErrors && (
              <span className="errors">{validationErrors.type}</span>
            )}
          </div>
          <label htmlFor="privacy">
            <p>
              Does this faction operate in the shadows as private or openly in
              the public eye?
            </p>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option
                className="placeholder-select"
                disabled
                value="placeholder"
              >
                (select one)
              </option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </label>
          <div className="errors-div">
            {"privacy" in validationErrors && (
              <span className="errors">{validationErrors.privacy}</span>
            )}
          </div>
          <label htmlFor="imageUrl">
            <p>Add an image or calling card for your faction below:</p>
            <input
              id="group-imageUrl"
              type="url"
              name="imageUrl"
              placeholder="Image Url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          <div className="errors-div">
            {"imageUrl" in validationErrors && (
              <span className="errors">{validationErrors.imageUrl}</span>
            )}
          </div>
        </div>
        <div>
          <button onSubmit={handleSubmit}>Establish your Faction!</button>
        </div>
      </form>
    </section>
  );
};

export default CreateGroup;
