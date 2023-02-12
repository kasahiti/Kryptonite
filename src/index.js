import ReactDOM from 'react-dom/client';
import { createContext, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

//
import axios from 'axios';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';



// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

if (localStorage.getItem("user") === null) {
  localStorage.setItem('user', JSON.stringify({name: '', auth: false}));
}

const UserContext = createContext(localStorage.getItem('user'));

const baseAPI = "https://kryptonite-backend.adron.ch/api";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const login = (name, pass) => {
    const json = JSON.stringify({username: name, password: pass});

    return axios.post(`${baseAPI}/auth/signin`, json, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        setUser({name, auth: true});
        localStorage.setItem('user', JSON.stringify({name, auth: true}));
        return true;
      })
      .catch(() => false);
  };

  // Logout updates the user data to default
  const logout = () => {
    axios.post(`${baseAPI}/auth/signout`, {
      withCredentials: true,
    })
      .then(response => {
        console.log(response.data)
        setUser({name: '', auth: false});
        localStorage.setItem('user', JSON.stringify({name: '', auth: false}));
      })

    setUser({
      name: '',
      password: '',
      auth: false,
    });
  };

  const changePassword = (newPassword) => {
    return axios.post(`${baseAPI}/auth/password`, newPassword, {
      headers: {
        'Content-Type': 'plain/text'
      },
      withCredentials: true
    })
      .then(() => true)
      .catch(() => false)
  }

  return (
    <UserContext.Provider value={{ user, login, logout, changePassword }}>
      {children}
    </UserContext.Provider>
  );
}

root.render(
  <HelmetProvider>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={ <App /> }> </Route>
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