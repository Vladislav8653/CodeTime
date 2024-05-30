"use strict";

document.getElementsByName('signup').addEventListener('submit', function (event) {
    event.preventDefault();
    var username = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if (username.length > 30 || password.length > 30) {
        return Promise.reject('Field length exceeds the limit');
    }
    //sendLoginRequest(username, password);
    alert("signup: " + username + password)
    //sendLoginRequest(username, password);
    //connection.invoke("GetUserInfo", username, password);
});


document.getElementsByName('login').addEventListener('submit', function (event) {
    event.preventDefault();
    var username = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if (username.length > 30 || password.length > 30) {
        return Promise.reject('Field length exceeds the limit');
    }
    //sendLoginRequest(username, password);
    alert("login: " + username + password)
    //sendLoginRequest(username, password);
    //connection.invoke("GetUserInfo", username, password);
});


function sendLoginRequest(username, password) {
    return fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(data => {
            return JSON.stringify(data); // Преобразовываем объект в строку
        })
        .catch(error => {
            console.error('Error:', error);
            return 'Error occurred'; // Возвращаем строку с сообщением об ошибке
        });
}

document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
    event.preventDefault();
    showNotification('Unluck...');
});
function showNotification(text) {
    var notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000); // Уведомление будет скрыто через 3 секунды
}


