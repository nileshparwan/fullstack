import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import './Auth.css';

// Define the mutation function
const CreateAuthMutation = async (eventData) => {
    let data;

    const requestBody = eventData.login ?
        JSON.stringify({
            query: `
                mutation {
                    login(email: "${eventData.email}", password: "${eventData.password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }) :
        JSON.stringify({
            query: `
                mutation {
                    createUser(userInput: {email: "${eventData.email}", password: "${eventData.password}"}) {
                        _id
                        email
                    }
                }
            `
        });

    try {
        const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        data = await response.json();
    } catch (err) {
        throw new Error("Failed!");
    }

    if (data.errors && data.errors.length > 0) {
        throw new Error(JSON.stringify({
            message: "Request generated multiple errors",
            requestBody,
            errors: data.errors
        }));
    }

    return data;
};

const useAuth = () => {
    return useMutation({
        mutationFn: CreateAuthMutation,
        onMutate: (variables) => {
            // A mutation is about to happen!
            console.log("onMutate", {variables})

            // Optionally return a context containing data to use when for example rolling back
            return { id: 1 };
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log("onError", {
                error, variables, context
            })
            console.log(`rolling back optimistic update with id ${context.id}`);
        },
        onSuccess: (data, variables, context) => {
            console.log("onSuccess", {data, variables, context})
            // Boom baby!
        },
        onSettled: (data, error, variables, context) => {
            console.log("onSettled", {data, error, variables, context})
            // Error or success... doesn't matter!
        },
    });
}

const Auth = () => {
    const [login, setLogin] = useState(false);
    const emailref = React.useRef(null);
    const passwordRef = React.useRef(null);
    // example 1
    // const { mutate, isSuccess, isError } = useMutation({ mutationFn: CreateAuthMutation })

    // if(isSuccess){
    //     console.log("isSuccess");
    // }

    // if(isError){
    //     console.log("isError", isError);
    // }

    // example 2 
    // const mutation = useMutation({ mutationFn: CreateAuthMutation })

    // example 3 
    const mutation = useAuth(); 

    const submitHandler = async (event) => {
        event.preventDefault();
        const password = passwordRef.current.value;
        const email = emailref.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        const eventData = {
            login,
            email,
            password
        }

        // example 1 
        // mutate(eventData)

        // example 2 
        // try {
        //     await mutation.mutateAsync(eventData);
        // } catch (error) {
        //     // Handle error
        //     console.error("error awaiting mutation")
        // }

        // example 3
        mutation.mutate(eventData);

    };

    return (
        <div className='auth-page'>
            <h1>{login ? "Login" : "Register"}</h1>
            <form className='auth-form'>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        aria-label="Email"
                        aria-required="true"
                        autoComplete="email"
                        ref={emailref}
                        required
                    />
                </div>

                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        aria-label="Password"
                        aria-required="true"
                        autoComplete="current-password"
                        ref={passwordRef}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => setLogin(props => !props)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                console.log('Switch to Signup');
                            }
                        }}
                    >
                        Switch to {login ? "Signup" : "Login"}
                    </button>
                    <button
                        type="submit"
                        onClick={submitHandler}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth; 