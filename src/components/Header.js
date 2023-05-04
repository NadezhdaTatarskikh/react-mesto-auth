import React from "react";
import logo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

const Header = ({ loggedIn, email, onSignOut }) => {
  const location = useLocation();
  const linkText = (location.pathname === '/sign-in') ? 'Регистрация' : 'Войти';
  const buttonText = loggedIn ? 'Выйти' : linkText;

  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="Логотип Mesto" />
      <div className='header__info'>
        <Link to="/sign-up" className="header__link-buttom">
          Регистрация
        </Link>
        <Link to="/sign-in" className="header__link-buttom">
          Войти
        </Link> 
      {loggedIn && (
        <nav className="header__nav">
          <span className="header__email">{email}</span>
          <button className="header__link-buttom header__link-buttombutton_type_authorized" onClick={() => onSignOut()}>
            {buttonText}
          </button>
        </nav>
      )}
      </div>
    </header>
  )
};

export default Header;
