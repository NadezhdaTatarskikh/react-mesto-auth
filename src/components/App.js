import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./Header.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import Footer from "./Footer.js";
import ProtectedRouteElement from "./ProtectedRoute.js";
import api from "../utils/Api.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import PopupWithDeleteCard from "./PopupWithDeleteCard.js";

import Register from "./Register.js";
import Login from "./Login.js";

function App() {
  /**переменные состояния попапов */
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = React.useState(false);
  const [isDeleteCardPopapOpen, setIsDeleteCardPopupOpen] =
    React.useState(false);

  const [isRenderLoading, setIsRenderLoading] = React.useState(false);

  /**Переменные состояния для попапа открытия карточки*/
  const [selectedCard, setSelectedCard] = React.useState(null);

  /**переменные состояния пользователя*/
  const [currentUser, setCurrentUser] = React.useState({});

  //**переменную состояния карточки*/
  const [cards, setCards] = React.useState([]);

  /**Переменные состояния зарегистрированного пользователя*/
  const [loggedIn, setLoggedIn] = useState(false);

  // стейт хедера
  const [userEmail] = useState("");

  //добавили хук истории
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInitialCards(), api.getUserInfo()]);
      api
        .getUserInfo()
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  }, [loggedIn]); // добавляем зависимость

  /**Открытие попапов */
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsCardPopupOpen(true);
  }

  function handleCardDeleteClick(card) {
    setSelectedCard(card);
    setIsDeleteCardPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardPopupOpen(false);
    setSelectedCard(null);
    setIsDeleteCardPopupOpen(false);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }
  function handleCardDelete() {
    setIsRenderLoading(true);
    api
      .deleteCard(selectedCard._id)
      .then(() => {
        setCards((cards) =>
          cards.filter((item) => item._id !== selectedCard._id)
        );
      })
      .then(() => closeAllPopups())
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsRenderLoading(false));
  }

  function handleAddCard(card) {
    setIsRenderLoading(true);
    api
      .newCardElement(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsRenderLoading(false));
  }

  /**Изменяем данные пользователя*/
  function handleUpdateUser(userInfo) {
    setIsRenderLoading(true);
    api
      .editUserInfo(userInfo)
      .then((userInfoServer) => {
        setCurrentUser(userInfoServer);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsRenderLoading(false));
  }

  /**Изменить аватар пользователя*/
  function handleUpdateAvatar(data) {
    setIsRenderLoading(true);
    api
      .editAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsRenderLoading(false));
  }

  // выход пользователя
  function handleSingOut() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    navigate.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          userEmail={userEmail}
          onSignOut={handleSingOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRouteElement
                element={Main}
                loggedId={loggedIn}
                onEditProfile={handleEditProfileClick}
                onEditAvatar={handleEditAvatarClick}
                onAddPlace={handleAddPlaceClick}
                cards={cards}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteClick}
              />
            }
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
        </Routes>
        <Footer loggedIn={loggedIn} />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isRenderLoading={isRenderLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCard}
          isRenderLoading={isRenderLoading}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isCardPopupOpen}
          onClose={closeAllPopups}
        />
        <PopupWithDeleteCard
          isOpen={isDeleteCardPopapOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
          isRenderLoading={isRenderLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isRenderLoading={isRenderLoading}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
