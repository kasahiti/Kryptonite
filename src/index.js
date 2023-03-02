import ReactDOM from 'react-dom/client';
import {createContext, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {Route, Routes} from 'react-router';
import {HelmetProvider} from 'react-helmet-async';

//
import axios from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';


// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

if (localStorage.getItem("user") === null) {
    localStorage.setItem('user', JSON.stringify({email: '', auth: false, token: '', firstName: '', lastName: ''}));
}

const UserContext = createContext(localStorage.getItem('user'));


const UserProvider = ({children}) => {
    const baseAPI = "https://krypto-backend.adron.ch/api";
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const clearUser = () => {
        localStorage.setItem('user', JSON.stringify({email: '', auth: false, token: '', firstName: '', lastName: ''}));

        setUser({
            email: '',
            password: '',
            auth: false,
            firstName: '',
            lastName: ''
        });
    }

    const login = (email, pass) => {
        const json = JSON.stringify({email, password: pass});

        return axios.post(`${baseAPI}/auth/login`, json, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                setUser({email, auth: true, token: response.data.token, firstName: response.data.firstName, lastName: response.data.lastName});
                localStorage.setItem(
                    'user',
                    JSON.stringify({
                        email,
                        auth: true,
                        token: response.data.token,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName}
                    ));
                return true;
            })
            .catch(() => false);
    };

    // Logout updates the user data to default
    const logout = () => {
        clearUser();
    };

    const changePassword = (newPassword) => {
        return axios.post(`${baseAPI}/auth/password`, newPassword, {
            headers: {
                'Content-Type': 'plain/text'
            }
        })
            .then(() => true)
            .catch(() => false)
    }

    const modifyDetails = (fName, lName, newMail) => {
        const data = JSON.stringify({
            "firstName": fName,
            "lastName": lName,
            "email": user.email,
            "newEmail": newMail
        });
        
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseAPI}/auth/modify`,
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            data
        };

        return axios(config)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem('user', JSON.stringify({...user, firstName: fName, lastName: lName, email: newMail, token: response.data.token}));
                setUser(JSON.parse(localStorage.getItem('user')));
                return true;
            })
            .catch((error) => {
                console.error(error);
                return false;
            })
    }

    return (
        <UserContext.Provider value={{user, login, logout, changePassword, modifyDetails, baseAPI}}>
            {children}
        </UserContext.Provider>
    );
}

root.render(
    <HelmetProvider>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<App/>}> </Route>
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export default UserContext;