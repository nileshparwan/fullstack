import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css';
import useAppContext from '../../context/auth-context';

const NavLinks = (props) => {
    const { isLoggedIn, userId, logout } = useAppContext();
    return (
        <ul className='nav-links'>
            <li>
                <NavLink to="/">ALL USERS</NavLink>
            </li>

            {isLoggedIn && <li>
                <NavLink to={`/${userId}/places`}>MY PLACES</NavLink>
            </li>}

            {isLoggedIn && <li>
                <NavLink to="/places/new">ADD PLACES</NavLink>
            </li>}

            {!isLoggedIn && <li>
                <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>}

            {isLoggedIn && <li>
                <button onClick={logout}>LOGOUT</button>
            </li>}
        </ul>
    );
};

export default NavLinks;