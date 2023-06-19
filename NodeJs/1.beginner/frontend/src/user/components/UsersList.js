import React from 'react';
import Card from '../../shared/components/UiElement/Card';
import { UserItem } from './UserItem';
import './Userlist.css';

export const UsersList = (props) => {
    const { items } = props;

    if (items.length === 0) {
        return (
            <div className='center'>
                <Card>
                    <h2>No users found</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className='users-list'>
            {
                items.map(user => {
                    return (
                        <UserItem
                            key={user.id}
                            id={user.id}
                            image={user.image}
                            name={user.name}
                            placeCount={user.places.length}
                        />
                    );
                })
            }
        </ul>
    );
};
