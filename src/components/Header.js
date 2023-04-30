import React from "react";
import logo from "../images/logo.svg";
import { Link, useLocation, Route, Routes } from "react-router-dom";

const Header = ({ loggedIn, userEmail, onSignOut }) => {
  const location = useLocation();
  const linkText = (location.pathname === '/sign-in') ? 'Регистрация' : 'Войти';
  const buttonText = loggedIn ? 'Выйти' : linkText;

  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Логотип Mesto" />
      <div className='header__info'>
      <Routes>
      <Route path="/sign-up" 
      element={<Link to="/sign-in" className="header__link">
          Войти
        </Link>} />
        <Route path="/sign-in"
         element={<Link to="/sign-up" className="header__link">
          Регистрация
        </Link>} />
        </Routes>
      {loggedIn && (
        <nav className="header__nav">
          <span>{userEmail}</span>
          <button className="header__sign-out" onClick={() => onSignOut()}>
            {buttonText}
          </button>
        </nav>
      )}
      </div>
    </header>
  );
};

export default Header;
