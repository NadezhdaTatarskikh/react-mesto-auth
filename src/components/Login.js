import React, { useState } from "react";

const Login = ({ onLogin }) => {
    const [loginDataUser, setLoginDataUser] = useState({ email: "", password: "" });

    function handleChange(evt) {
        const { name, value } = evt.target;
        setLoginDataUser(prevState => ({ ...prevState, [name]: value }));
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onLogin({
            email: loginDataUser.email,
            password: loginDataUser.password
        });
    }
    return (
        <div className="auth">
            <h3 className="auth__title">Вход</h3>
            <form className="form" onSubmit={handleSubmit}>
                <input
                id="email"
                required
                type="email"
                autoComplete="email"
                className="form__input form__input_type_email"
                name="email"
                placeholder="email"
                value={loginDataUser.email || ''}
                onChange={handleChange}
                />
                <span className="auth__error"></span>
                <input
                id="password"
                required
                type="password"
                autoComplete="password"
                className="form__input form__input_type_password"
                name="password"
                placeholder="password"
                value={loginDataUser.password || ''}
                onChange={handleChange}
                />
                <span className="auth__error"></span>
                <button className="form__button form__button_type_register" type="submit">Войти</button>
         </form>
      </div>
   )
};

export default Login;
