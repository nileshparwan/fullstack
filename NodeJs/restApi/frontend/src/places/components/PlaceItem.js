import React, { useContext, useState } from 'react';
import './PlaceItem.css';
import Card from '../../shared/components/UiElement/Card';
import Button from '../../shared/components/FormsElements/Button';
import Modal from '../../shared/components/UiElement/Modal';
import Map from '../../shared/components/UiElement/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import Config from '../../config/config.json'

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, ClearError } = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${Config.api.domain}${Config.api.feature.deletePlaceById.replace("#{placeId}", props.id)}`,
        "DELETE",
        null,
        {
          Authorization: `Bearer ${auth.token}`
        }
      );
      props.onDelete(props.id);
    } catch (err) {

    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={ClearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
            <Button danger onClick={confirmDeleteHandler}>Delete</Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place?
          Please note that cannot be undone thereafter
        </p>
      </Modal>

      <li className='place-item'>
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className='place-item__image'>
            <img src={`${Config.api.domain}/${props.image}`} alt={props.description} />
          </div>

          <div className='place-item__info'>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>

          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.userId === props.creatorId && (
              <React.Fragment>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
              </React.Fragment>
            )
            }
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;