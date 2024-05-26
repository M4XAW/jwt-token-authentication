import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/FormPage.scss'

import { useAuth } from '../../auth/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!username && !password) {
            return setError('Le nom d\'utilisateur et le mot de passe sont requis');
        }

        if (!username) {
            return setError('Le nom d\'utilisateur est requis');
        }

        if (!password) {
            return setError('Le mot de passe est requis');
        }

        try {
            const response = await axios.post('http://localhost:5086/api/login', {
                username,
                password
            });

            if (response.status === 200) {
                login(response.data.token);
                navigate("/profile");
            } else {
                console.error("Une erreur s'est produite lors de la connexion");
                setError("Une erreur s'est produite lors de la connexion");
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Le nom d\'utilisateur ou le mot de passe est incorrect');
            }
        } finally {
            setUsername('');
            setPassword('');
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
            {/* <Link to="/register" className="linkPage">Créer un compte</Link> */}
            <div className="formContainer">
                <h1>Se connecter</h1>
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
                        className={error && !password ? "errorOutline" : ""}
                    />
                    <button type="submit" disabled={isButtonDisabled()}>Se connecter</button>
                </form>
                {error && <p className="errorMessage">{error}</p>}
            </div>
        </div >
    )
}
