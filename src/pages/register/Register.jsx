import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/FormPage.scss';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const isValidPassword = (password) => {
        return password.length >= 12;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!username && !password) {
            setError('Le nom d\'utilisateur et le mot de passe sont requis');
            return;
        }

        if (!username) {
            setError('Le nom d\'utilisateur est requis');
            return;
        }

        if (!password) {
            setError('Le mot de passe est requis');
            return;
        }

        // if (!isValidPassword(password)) {
        //     setError('Le mot de passe doit avoir au moins 12 caractères');
        //     return;
        // }

        try {
            await axios.post('http://localhost:5086/api/register', {
                username,
                password
            });

            navigate('/');
        } catch (error) {
            console.error(error);

            if (error.response && error.response.status === 409) {
                setError('Le nom d\'utilisateur existe déjà');
            };
        }
    };

    const handleInputChange = () => {
        setError('');
    };

    const isButtonDisabled = () => {
        return !username || !password;
    };

    return (
        <div className="formPage">
            {/* <Link to="/login" className="linkPage">Se connecter</Link> */}
            <div className="formContainer">
                <h1 className='textGradient'>Créer un compte</h1>
                <form onSubmit={handleFormSubmit}>
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        type="text"
                        id='username'
                        placeholder="m4x4m"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); handleInputChange(); }}
                        className={error && !username ? "errorOutline" : ""}
                    />
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type='password'
                        id='password'
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                        className={error && !isValidPassword(password) ? "errorOutline" : ""}
                    />
                    <button type="submit" disabled={isButtonDisabled()}>Créer un compte</button>
                </form>
                {error && <p className="errorMessage">{error}</p>}
            </div>
        </div>
    );
}
