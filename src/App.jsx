import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';

import { useAuth } from "./auth/AuthContext";

import Header from './components/header/Header';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Profile from './pages/profile/Profile';
import NotFound from './pages/notFound/NotFound';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
          </>
        ) : (
          <Route path="/profile" element={<Profile />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;