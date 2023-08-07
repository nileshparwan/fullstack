import React, { useState } from 'react';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UiElement/Card';
import useAppContext from '../../shared/context/auth-context';
import Input from '../../shared/components/FormsElements/Input';
import Button from '../../shared/components/FormsElements/Button';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validator';
import Config from '../../config/config.json';
import './Auth.css';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/components/FormsElements/ImageUpload';

const Auth = () => {
  const { login } = useAppContext();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: "",
      isValid: false
    }
  }, false);

  const { ClearError, isLoading, error, sendRequest } = useHttpClient();

  const AuthenticationMethods = async (isLoginMode, formState) => {
    if (isLoginMode) {

      try {
        const response = await sendRequest(
          `${Config.api.domain}${Config.api.feature.login}`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json',
          }
        );

        login(response.userId, response.token);
      } catch (err) {

      }


    } else {

      try {
        // when we send file, we cannot use a json stringify. Intead we must use formData. 
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value); // this should have a key of 'image' because on the backend we are looking for image. check signup route upload(image)

        const response = await sendRequest(
          `${Config.api.domain}${Config.api.feature.signup}`,
          'POST',
          formData,
          // { with form data, it automatically add the headers 
          //   'Content-Type': 'application/json'
          // }
        );

        login(response.userId, response.token);
      } catch (err) {

      }

    }
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    await AuthenticationMethods(isLoginMode, formState);
  };

  const switchModeHandler = (event) => {
    event.preventDefault();

    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: "",
          isValid: false
        }
      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={ClearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <div>
          {
            !isLoginMode && <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name"
              onInput={inputHandler}
            />
          }

          {
            !isLoginMode && (
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image"
              />
            )
          }

          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password"
            onInput={inputHandler}
          />
          <Button
            type="button"
            disabled={!formState.isValid}
            onClick={authSubmitHandler}
          >
            {isLoginMode ? "LOGIN" : "Sign up"}
          </Button>
          <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? "Sign up" : "LOGIN"}</Button>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default Auth;