import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import PlaceList from '../components/PlaceList';
import Config from '../../config/config.json';

const UserPlaces = (props) => {
  const [loadedPlaces, setLoadedPlaces] = useState(); 
  const {isLoading, error, sendRequest, ClearError} = useHttpClient();
  const userId = useParams().userId;

  const GetPlaces = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `${Config.api.domain}${Config.api.feature.userPlacesById.replace("#{userId}", userId)}`
        
      );
      setLoadedPlaces(responseData.places);
    } catch (err) {

    }
  }, [sendRequest, userId]);

  useEffect(()=>{
    GetPlaces();
  }, [GetPlaces]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces(prev => prev.filter(place => place.id !== deletedPlaceId))
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={ClearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
    </React.Fragment>
  );
};

export default UserPlaces;