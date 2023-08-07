

import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    /**
     * A reference here is just a piece of data which wll not change or in this case 
     * which will not be re initialized when this function runs again whenever the  
     * component which uses this hook re renders. 
     * So not this will basivally store data across three renderer cycles, you could say. 
     */
    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        setIsLoading(true);
        console.log(url, method, body, headers);
        // for example, what if the request is on its way then we switch page 
        // then we will get an error because it will try to update the state of 
        // a component which is not mounted ( not present on the page anymore ) 
        const httpAbortController = new AbortController(); // abort fetch api
        console.log("httpAbortControlle = ", httpAbortController);
        activeHttpRequest.current.push(httpAbortController);
        const signal = httpAbortController.signal; // this links "const httpAbortController = new AbortController()" to this request

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal
            });
            // now you can use "const httpAbortController = new AbortController()" to cancel the fetch request
            const responseData = await response.json();

            /**
             * Once we have a response we know that the request is completed
             */

            activeHttpRequest.current = activeHttpRequest.current.filter(
                reqCtrl => reqCtrl !== httpAbortController
            ); 

            /**
             * filter all request controllers and remove the request controller which
             * i used for this request, which i do with this logic. This keeps every 
             * controller except for the controller which was used in this request. 
             */

            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false);
            return {...response, ...responseData};
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }

    }, []);

    const ClearError = () => {
        setError(null);
    };

    useEffect(() => {
        return () => {
            // clean this logic when component unmounts
            console.log("activeHttpRequest = ", activeHttpRequest);
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return {
        isLoading,
        error,
        sendRequest,
        ClearError
    };
};