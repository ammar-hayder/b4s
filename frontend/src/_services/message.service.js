import config from 'config';
import { authHeader } from '../_helpers';

export const messageService = {
    newMessage,
    logout,
    getAll,
    getMessagesByUserId,
    newMessageReply,
};

function newMessage(text) {
  console.log(text);
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({text: text.message })
    };

    return fetch(`${config.apiUrl}/messages`, requestOptions)
        .then(handleResponse);
}

function newMessageReply(text, messageIdForReply) {
  console.log(text, messageIdForReply);
    const requestOptions = {
        method: 'POST',
        headers: {...authHeader(), 'Content-Type': 'application/json'},
        body: JSON.stringify({text: text, messageId:messageIdForReply })
    };

    return fetch(`${config.apiUrl}/messages-reply`, requestOptions)
        .then(handleResponse);
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/messages`, requestOptions).then(handleResponse);
}
function getMessagesByUserId(userid) {
  const requestOptions = {
      method: 'GET',
      headers: authHeader()
  };

  return fetch(`${config.apiUrl}/messages/${userid}`, requestOptions).then(handleResponse);
}
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}