import React, {createContext, useState} from 'react';

export const LoginContext = createContext();

export const LoginProvider = props =>{
    let logged = localStorage.getItem('token') === null ? 'loggedOut' : 'loggedIn';
    const [Login, setLogin] = useState(logged);

    return(
        <LoginContext.Provider value={[Login,setLogin]}>
            {props.children}
        </LoginContext.Provider>
    )

}