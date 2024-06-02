"use strict";

connection.start();

alert(52+"сво_zov_гойда")
let videoChunks = [];
let videoDecoder = new TextDecoder();
connection.on("ReceiveVideo", function (user, videoPacket) {
    //alert("вызвана функция ресив видео");
    videoChunks.push(videoPacket);
    // Проверяем, если это последний пакет
    if (videoPacket.endsWith("END_PACKET")) {
        alert("вызвана функция ресив видео - последний пакет");
        const videoData = videoChunks.join('');
        const base64Video = videoData.replace(/END_PACKET/g, '');
        const videoBytes =  base64ToUint8Array(base64Video);
        const videoBlob = new Blob([videoBytes], { type: 'video/mp4' });
        saveVideoToFile(videoBlob);
        videoChunks = [];
    }
});

document.getElementById("start").addEventListener("click", async function (event) {
    const user = document.getElementById("userInput").value;
    try {
        //const videoArrayBuffer = await selectVideoFromFile();
        const videoArrayBuffer = await recordScreen();
        const base64Video = await blobToBase64(videoArrayBuffer);
        const label = document.getElementById("text");
        let arr = splitStringByLength(base64Video, 20000);
        arr[arr.length - 1] += "END_PACKET"; 
        for (let i = 0; i < arr.length; i++){
            await connection.invoke("GetVideo", user, arr[i]);
            label.textContent += (i+1) + ", ";
        }
    } catch (err) {
        console.error(err.toString());
    }
    event.preventDefault();
});

function splitStringByLength(str, n) {
    const regex = new RegExp(`.{1,${n}}`, 'g');
    return str.match(regex);
}