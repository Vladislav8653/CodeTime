class AuthenticationHub {
    static instance = null;

    constructor() {
        if (AuthenticationHub.instance) {
            return AuthenticationHub.instance;
        }

        this.connection = new signalR.HubConnectionBuilder().withUrl("/Authentication").build();
        this.connection.start();

        AuthenticationHub.instance = this;
    }

    getConnection() {
        return this.connection;
    }
}

const authenticationHub = new AuthenticationHub();
const auth = authenticationHub.getConnection();


alert("Connection started")
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            showNotification('Unluck...');
        });
    }
    const loginSendBtn = document.getElementById('login');
    if (loginSendBtn) {
        document.getElementById('login').addEventListener('submit', function (event) {
            event.preventDefault();
            var username = document.getElementById('user').value;
            var password = document.getElementById('pass').value;
            if (username.length > 30 || password.length > 30) {
                showNotification('Field length exceeds the limit 30 symbols.');
                return;
            }
            alert("login: " + username + password)
            auth.invoke("GetUserInfo", username, password);
        });
    }

    const sighUpSendBtn = document.getElementById('signup');
    if (sighUpSendBtn) {
        document.getElementById('signup').addEventListener('submit', function (event) {
            event.preventDefault();
            var username = document.getElementById('user').value;
            var password = document.getElementById('pass').value;
            if (username.length > 30 || password.length > 30) {
                showNotification("Field length exceeds the limit 30 symbols.");
                return;
            }
            alert("signup: " + username + password)
            auth.invoke("GetNewUserInfo", username, password);
        });
    }
});

function showNotification(text) {
    var notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000); // Уведомление будет скрыто через 3 секунды
}