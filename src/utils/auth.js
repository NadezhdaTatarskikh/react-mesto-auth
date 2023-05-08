export const BASE_URL = 'https://auth.nomoreparties.co';

//проверяем ответ с сервера
const checkResponse = (res) => {
    if (res.ok) {
      return res.json();
    } 
    // если ошибка, отклоняем промис
    return Promise.reject(
      new Error(`Ошибка ${res.status}: ${res.statusText}`)
      );
  }

const headers = {
  Acceert: 'application/json',
  'Content-Type': 'application/json'
}

export const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  })
  .then((res) => checkResponse(res));
};

export const login = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  })
  .then((res) => checkResponse(res));
};

//делаем запрос токена
export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => checkResponse(res));
  };
  