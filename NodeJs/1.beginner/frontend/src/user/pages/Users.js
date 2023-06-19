import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import ErrorModal from '../../shared/components/UiElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UiElement/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { UsersList } from '../components/UsersList';
import Config from '../../config/config.json'

const User = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { isLoading, error, sendRequest, ClearError } = useHttpClient();

    const GetUser = useCallback(async () => {
        const response = await sendRequest(`${Config.api.domain}${Config.api.feature.getUsers}`);
        setLoadedUsers(response.users);
    }, [sendRequest]);

    useEffect(() => {
        GetUser();
    }, [GetUser]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={ClearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};

export default User;