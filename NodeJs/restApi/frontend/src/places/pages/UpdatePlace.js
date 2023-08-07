import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../shared/components/FormsElements/Input';
import Button from '../../shared/components/FormsElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validator';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UiElement/Card';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import Config from '../../config/config.json'

const UpdatePlace = (props) => {
	const auth = useContext(AuthContext)
	const placeId = useParams().placeId;
	const navigate = useNavigate();
	const [loadedPlace, setLoadedPlace] = useState();
	const { isLoading, error, sendRequest, ClearError } = useHttpClient();
	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: '',
				isValid: true
			},
			description: {
				value: '',
				isValid: true
			}
		},
		true
	);

	const GetPlaces = useCallback(async () => {
		try {
			const response = await sendRequest(
				`${Config.api.domain}${Config.api.feature.getPlacesById.replace("#{placeId}", placeId)}`
			);
			setLoadedPlace(response.place);

			setFormData({
				title: {
					value: response.place.title,
					isValid: true
				},
				description: {
					value: response.place.description,
					isValid: true
				}
			}, true);
		} catch (err) {

		}
	}, [placeId, sendRequest, setFormData]);

	const placeUpdateSubmitHandler = async event => {
		event.preventDefault();
		try {
			await sendRequest(
				`${Config.api.domain}${Config.api.feature.updatePlaceById.replace("#{placeId}", placeId)}`,
				"PATCH", 
				JSON.stringify({
					title:formState.inputs.description.value,
					description:formState.inputs.description.value
				}),
				{
					"Content-Type": "application/json",
					Authorization: `Bearer ${auth.token}`
				}
			);
			navigate(`/${auth.userId}/places`);
		} catch (err) {

		}
	};

	useEffect(() => {
		GetPlaces();
	}, [GetPlaces]);


	if (isLoading) {
		return (
			<div className="center">
				<LoadingSpinner />
			</div>
		);
	}

	if (!loadedPlace && !error) {
		return (
			<Card>
				<div className="center">
					<h2>Could not find place!</h2>
				</div>
			</Card>
		);
	}

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={ClearError} />
			{
				!isLoading && !!loadedPlace && (
					<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
						<Input
							id="title"
							element="input"
							type="text"
							label="Title"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter a valid title."
							onInput={inputHandler}
							initialValue={formState.inputs.title.value}
							initialValid={formState.inputs.title.isValid}
						/>
						<Input
							id="description"
							element="textarea"
							label="Description"
							validators={[VALIDATOR_MINLENGTH(5)]}
							errorText="Please enter a valid description (min. 5 characters)."
							onInput={inputHandler}
							initialValue={formState.inputs.description.value}
							initialValid={formState.inputs.description.isValid}
						/>
						<Button type="submit" disabled={!formState.isValid}>
							UPDATE PLACE
						</Button>
					</form>
				)
			}
		</React.Fragment>
	);
};

export default UpdatePlace;