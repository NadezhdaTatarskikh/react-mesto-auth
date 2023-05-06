import React, { useEffect, useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import api from "../utils/Api.js";
import * as auth from "../utils/auth.js";
import Header from "./Header.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import Footer from "./Footer.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import PopupWithDeleteCard from "./PopupWithDeleteCard.js";
import Register from "./Register.js";
import Login from "./Login.js";
import InfoTooltip from "./InfoTooltip .js"; 

function App() {
  /**переменные состояния попапов */
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [isDeleteCardPopapOpen, setIsDeleteCardPopupOpen] = useState(false);

  const [isRenderLoading, setIsRenderLoading] = useState(false);

  /**Переменные состояния для попапа открытия карточки*/
  const [selectedCard, setSelectedCard] = useState(null);

  /**переменные состояния пользователя*/
  const [currentUser, setCurrentUser] = useState({});

  //**переменную состояния карточки*/
  const [cards, setCards] = React.useState([]);

  // переменная логина
  const [loggedIn, setLoggedIn] = useState(false);

  // переменные хедера
  const [headerEmail, setHeaderEmail] = useState('');

  //переменные InfoTooltip
  const [registerSuccess, setRegisterSuccess] = useState(false); //open popup 
  const [infoSuccess, setInfoSuccess] = useState(true); 

  //добавили хук истории
  const navigate = useNavigate();

  useEffect(() => {
    if(loggedIn) {
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
    }, [loggedIn]); 

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

  // закрытие попапов
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardPopupOpen(false);
    setSelectedCard(null);
    setIsDeleteCardPopupOpen(false);
    setRegisterSuccess(false);
  }

  // закрытие по ESC
	useEffect(() => {
		const closeByEscape = (e) => {
		  if (e.key === 'Escape') {
			closeAllPopups();
		  }
		}
		document.addEventListener('keydown', closeByEscape);
		return () => document.removeEventListener('keydown', closeByEscape);
	}, []);

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

  // Регистрация пользователи
  function handleRegistration(email, password) {
    auth.register(email, password)
    .then((res) => {
      navigate.push('/sign-in');
      setInfoSuccess(true);  
      return res;
    })
    .catch((err) => {
      setInfoSuccess(false);
      console.log(`Ошибка: ${err}`);
    })
.finally(() => {
  setRegisterSuccess(true);
});
  }

  // Авторизация пользователя
  function handleAuthorization(email, password) {
    auth.login(email, password)
    .then(data => {
      if(data.token) {
        localStorage.setItem('jwt', data.token);
       setLoggedIn(true);
       setHeaderEmail(email)
      }
  })
    .catch((err) => {
      setInfoSuccess(false);
      setRegisterSuccess(true);
      console.log(`Ошибка: ${err}`);
    });
  };

  // выход пользователя
  function handleSingOut() {
    setLoggedIn(false);
    setHeaderEmail('');
    localStorage.removeItem('jwt');
    navigate.push('/sign-in');
  }

  // Проверка токена
const tokenCheck = () => {
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
  auth.checkToken(jwt)
  .then(data => {
    if(data) {
    setHeaderEmail(data.data.email)
  }
  setLoggedIn(true);
  })
  .catch((err) => {
    console.log(`Ошибка: ${err}`);
  });
}
}

 useEffect(()=> {
    tokenCheck();
  }, []);

 useEffect(() => {
    if(loggedIn) {
      navigate.push('/');
    }
  }, [loggedIn, navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          email={headerEmail}
          onSignOut={handleSingOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
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
          <Route path="/sign-in" element={<Login setHeaderEmail={setHeaderEmail} login={handleAuthorization} onSignOut={handleSingOut}/>} />
          <Route path="/sign-up" element={<Register setHeaderEmail={setHeaderEmail} register={handleRegistration}/>} />
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
        <InfoTooltip
        isOpen={registerSuccess}
        onClose={closeAllPopups}
        name="success"
        success={infoSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
