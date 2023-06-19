import React, { useContext } from 'react';
import Input from '../../shared/components/FormsElements/Input';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validator';
import './PlaceForm.css';
import Button from '../../shared/components/FormsElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Config from '../../config/config.json';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import { useNavigate } from 'react-router-dom'
import ImageUpload from '../../shared/components/FormsElements/ImageUpload';

const NewPlace = () => {
  const navidate = useNavigate()
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, ClearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null, 
        isValid: false
      }
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData(); 
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);

      // replace Config.api.domain to use process.env.REACT_APP_BACKEND_URL environment variable
      await sendRequest(
        `${Config.api.domain}${Config.api.feature.places}`,
        "POST",
        formData,
        {
          // "Content-Type": "application/json"
          Authorization: `Bearer ${auth.token}`
        }
      );

      navidate("/")
    } catch (err) {

    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={ClearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image" />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}; 

export default NewPlace;