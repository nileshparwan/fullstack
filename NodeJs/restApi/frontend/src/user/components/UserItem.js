import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../shared/components/UiElement/Avatar';
import Card from '../../shared/components/UiElement/Card';
import Config from "../../config/config.json";
import './UserItem.css';

export const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className='user-item__content'>
        <Link to={`/${props.id}/places`}>
          <div className='user-item__image'>
            <Avatar
              image={`${Config.api.domain}/${props.image}`}
              alt={props.name}
            />
          </div>

          <div className='user-item__info'>
            <h2>{props.name}</h2>
            <h3>{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
