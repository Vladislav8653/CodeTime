const connectionHub = new Hub();
const connection = connectionHub.getConnection();

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name-input');
    //nameInput.disabled = true;
    const watchStream = document.querySelector('.watch-stream-btn');
    const startStream = document.querySelector('.start-stream-btn');

    watchStream.addEventListener('click', () => {
        nameInput.disabled = false;
        nameInput.focus();
    });

    startStream.addEventListener('click', () => {
        nameInput.disabled = true;
    });

    document.getElementById("start").addEventListener("click", async function (event) {
        try {
            await recordAndSendScreen();
        } catch (err) {
            console.error(err.toString());
        }
        event.preventDefault();
    });

    document.getElementById("join").addEventListener("click", async function (event) {
        const nameInput = document.getElementById('name-input');
        const username = nameInput.value;
        if (username.length > 30) {
            showNotification('Field length exceeds the limit 30 symbols.');
            return;
        }
        if (username.length === 0) {
            showNotification("Field length cannot be 0.");
            return;
        }
        await connection.invoke("A", username.toString());
    });
    
});

const videoElement = document.createElement('video');
let mediaSource = new MediaSource();
videoElement.src = URL.createObjectURL(mediaSource);
let sourceBuffer;
let isFirstChunk = true;


connection.on("ReceiveBroadcastOwnerId", function (answer) {
    if (answer === "false") {
        showNotification("User doesn't exist.");
    } else {
        selectTextFromFile()
            .then(function(fileContent) {
                const videoBytes = base64ToUint8Array(fileContent);
                const videoBlob = new Blob([videoBytes], { type: 'video/mp4' });
                const videoUrl = URL.createObjectURL(videoBlob);

                videoElement.src = videoUrl;
                videoElement.type = 'video/mp4';

                // Добавьте все остальные стили и настройки,
                // которые вы хотите применить к videoElement
                videoElement.id = 'videoPlayer';
                videoElement.controls = true;
                document.body.appendChild(videoElement);
                videoElement.style.position = 'fixed';
                videoElement.style.top = '0';
                videoElement.style.left = '0';
                videoElement.style.width = '100vw';
                videoElement.style.height = '90vh';
                videoElement.style.marginTop = '3px';
                videoElement.style.objectFit = 'contain';
                videoElement.style.zIndex = '9999';
                videoElement.style.borderRadius = '30px';
            })
            .catch(function(error) {
                console.error(error);
            });
    }
});

connection.on("ReceiveVideo", (videoChunk) => {
   
});

function showNotification(text) {
    var notification = document.getElementById('notification');
    notification.textContent = text;
    notification.classList.add('show');
    setTimeout(function() {
        notification.classList.remove('show');
    }, 3000); // Уведомление будет скрыто через 3 секунды
}
