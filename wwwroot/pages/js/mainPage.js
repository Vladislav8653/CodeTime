const connectionHub = new Hub();
const connection = connectionHub.getConnection();

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name-input');
    nameInput.disabled = true;
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
            const videoArrayBuffer = await recordScreen();
            const base64Video = await blobToBase64(videoArrayBuffer);
            let arr = splitStringByLength(base64Video, 20000);
            arr[arr.length - 1] += "END_PACKET";
            for (let i = 0; i < arr.length; i++){
                await connection.invoke("GetVideo", arr[i]);
            }
        } catch (err) {
            console.error(err.toString());
        }
        event.preventDefault();
    });

});

function splitStringByLength(str, n) {
    const regex = new RegExp(`.{1,${n}}`, 'g');
    return str.match(regex);
}