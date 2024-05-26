import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Header.scss";

import Logo from "../../assets/icons/elephant.webp";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();

  return (
    <header>
      <Link to="/" className="logo">
        <img src={Logo} alt="Logo" />
      </Link>
      <nav>
        <ul>
          {!isLoggedIn ? (
            location.pathname === "/" ? (
              <>
                <li>
                  <Link to="/register">Créer un compte</Link>
                </li>
              </>
            ) : location.pathname === "/register" ? (
              <>
                <li>
                  <Link to="/">Se connecter</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Connexion</Link>
                </li>
                <li>
                  <Link to="/register" className="linkRegister">Inscription</Link>
                </li>
              </>
            )
          ) : (
            <>
              {user && user.username ? (
                <>
                  <li>
                    <small className="username">Connecté en tant que {user.username}</small>
                  </li>
                  <li>
                    <Link to="/profile">Profil</Link>
                  </li>
                  <li>
                    <Link to="/" onClick={logout}>Déconnexion</Link>
                  </li>
                </>
              ) : (
                <li>
                  <span>Error</span>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}