const authenticationHub = new Hub();
const auth = authenticationHub.getConnection();

//alert("Connection started")
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
        document.getElementById('login').addEventListener('submit', async function (event) {
            event.preventDefault();
            var username = document.getElementById('user').value;
            var password = document.getElementById('pass').value;
            if (username.length > 30 || password.length > 30) {
                showNotification('Field length exceeds the limit 30 symbols.');
                return;
            }
            if (username.length === 0 || password.length === 0) {
                showNotification("Field length cannot be 0.");
                return;
            }
            //alert("login: " + username + password)
            await auth.invoke("GetUserInfo", username, password);
        });
    }

    const sighUpSendBtn = document.getElementById('signup');
    if (sighUpSendBtn) {
        document.getElementById('signup').addEventListener('submit', async function (event) {
            event.preventDefault();
            var username = document.getElementById('user').value;
            var password = document.getElementById('pass').value;
            if (username.length > 30 || password.length > 30) {
                showNotification("Field length exceeds the limit 30 symbols.");
                return;
            }
            if (username.length === 0 || password.length === 0) {
                showNotification("Field length cannot be 0.");
                return;
            }
            //alert("signup: " + username + password)
            await auth.invoke("GetNewUserInfo", username, password);
        });
    }
});

auth.on("CheckUser", function (answer) {
   //alert(answer);
   if (answer === "true") {
       window.location.href = 'mainPage.html';
   } else if (answer === 'false_exist') {
       showNotification("User already exists.");
   } else {
       showNotification("Invalid data.");
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