import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkCreateGroup, thunkAddImage } from "../../../store/groups";
import "./CreateGroupForm.css";

const CreateGroupForm = () => {
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
    if (!name) errors.name = "Name is required";
    if (about.length < 30)
      errors.about = "Description must be at least 30 characters long";
    if (type == "placeholder" || !type)
      errors.type = "Faction Type is required";
    if (privacy == "placeholder" || !privacy)
      errors.privacy = "Visibility Type is required even if you're invisible";
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
        setValidationErrors(createdGroup.errors);
      } else {
        await dispatch(thunkAddImage(createdGroup.id, newImageReqBody));
        navigate(`/groups/${createdGroup.id}`);
      }
    }
  };

  return (
    <section className="group-section">
      <h4>ORGANIZE YOUR OWN FACTION!</h4>
      <h2>Start a New Faction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Set your faction&apos;s base operation&apos;location</h2>
          <p>
            MutantMingle factions meet locally, in person and online.
            <br />
            We&apos;ll connect you with heroes or villains in your area.
          </p>
          <label htmlFor="city">
            <input
              type="text"
              name="city"
              id="group-city"
              placeholder="City"
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
          <h2>What will your Faction&apos;s name be?</h2>
          <p>
            Choose a name that will strike fear in the hearts of citizens or
            villains.
            <br />
            Be creative! Your faction name is critical! You can always change it
            later.
          </p>
          <label>
            <input
              type="text"
              id="group-name"
              placeholder="What is your faction name?"
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
          <h2>Describe the destiny of your faction.</h2>
          <label>
            <p>
              Other Heroes will see this when we promote your faction, but
              you&apos;ll be able to add to it later, too.
              <br />
              <br />
              1. What&apos;s the purpose of the faction?
              <br />
              2. Who should join?
              <br />
              3. What will you do at your campaigns?
            </p>
          </label>
          <textarea
            name=""
            id="group-about"
            cols="30"
            rows="10"
            placeholder="Please write at least 30 characters"
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
          <h2>Final steps...</h2>
          <label htmlFor="type">
            <p>Is this an in person or online faction?</p>
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
            <p>Is this faction private or public?</p>
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
            <p>Please add an image url for your faction below:</p>
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
          <button onSubmit={handleSubmit}>Assemble Faction!</button>
        </div>
      </form>
    </section>
  );
};

export default CreateGroupForm;
