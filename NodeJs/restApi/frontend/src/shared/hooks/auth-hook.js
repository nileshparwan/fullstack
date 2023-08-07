import { useCallback, useState, useEffect, useLayoutEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);

        const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token,
                expiration: expirationDate || tokenExpirationDate.toISOString()
                // toISOString to ensure that no data gets lost when this date is stringified
                // expirationDate -> take existing time unless expired then create new
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        localStorage.removeItem("userData");
    }, []);

    useLayoutEffect(() => {
        //  auto login
        const storeData = JSON.parse(localStorage.getItem("userData"));

        // check user already login before 
        // and check if the expiration time is not finished by verifying the timestamp of the
        // expiration time when it was set agaist current timeStamp;
        if (storeData && storeData.token && new Date(storeData.expiration) > new Date()) {
            login(storeData.userId, storeData.token, new Date(storeData.expiration));
        };

    }, [login]);

    useEffect(() => {
        // auto logout when time expires
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [logout, tokenExpirationDate, token]);

    return { token, login, logout, userId};
};