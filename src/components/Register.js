import { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({ onRegister }) => {
  const [ registrationValues, setRegistrationValues ] = useState({ email: '', password: '' });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setRegistrationValues({
        ...registrationValues,
        [name]: value
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault(); // Запрещаем браузеру переходить по адресу формы
    onRegister(registrationValues);
  };

  return (
    <>
      <div className="auth">
        <h2 className="auth__title">Регистрация</h2>
        <form className="form auth__form" onSubmit={handleSubmit}>
          <input
            id="email"
            required
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            className="form__input form__input_type_email"
            value={registrationValues.email}
            onChange={handleChange}
          />
          <span className="auth__error"></span>
          <input
            id="password"
            required
            type="password"
            name="password"
            placeholder="Пароль"
            autoComplete="password"
            className="form__input form__input_type_password"
            value={registrationValues.password}
            onChange={handleChange}
            />
            <span className="auth__error"></span>
            <button className="form__button form__button_type_register" type="submit">Зарегистрироваться</button>
        </form>
        <Link to="/sign-in" className="auth__login-hint">Уже зарегистрированы? Войти</Link>
      </div>
    </>
  );
};

export default Register;
