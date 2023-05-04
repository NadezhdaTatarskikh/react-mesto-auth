import React from "react";
import unsuccessIcon from "../images/unsuccessIcon.svg";
import successIcon from "../images/successIcon.svg";

const InfoTooltip = ({ isOpen, onClose, isSuccess }) => {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
          aria-label="Кнопка закрыть"
        ></button>
        <div className="popup__result">
          <img
            src={isSuccess ? successIcon : unsuccessIcon}
            alt={
              isSuccess ? "Регистрация прошла успешно" : "Регистрация не прошла"
            }
            className="popup__icon"
          />
          <h3 className="popup__title">
            {isSuccess
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default InfoTooltip;
