async function recordAndSendScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.addEventListener("dataavailable", async (event) => {
            chunks.push(event.data);
            const base64Video = await blobToBase64(new Blob([event.data], { type: 'video/mp4' }));
            const videoChunk = splitStringByLength(base64Video, 20000)[0];
            await connection.invoke("GetVideo", videoChunk);
        });

        mediaRecorder.addEventListener("stop", async () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const base64Video = await blobToBase64(blob);
            const arr = splitStringByLength(base64Video, 20000);
            arr[arr.length - 1] += "END_PACKET";
            for (let i = 1; i < arr.length; i++) {
                await connection.invoke("GetVideo", arr[i]);
            }
        });
        mediaRecorder.start();
    } catch (err) {
        console.error(err.toString());
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(",")[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function splitStringByLength(str, length) {
    const result = [];
    for (let i = 0; i < str.length; i += length) {
        result.push(str.slice(i, i + length));
    }
    return result;
}

function saveVideoToFile(videoBytes) {
    var blob = new Blob([videoBytes], { type: 'video/mp4' });
    var url = URL.createObjectURL(blob);
    // Создаем ссылку для скачивания файла
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'video.mp4';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    // Автоматически кликаем по ссылке для скачивания файла
    downloadLink.click();
    // Освобождаем ресурсы
    URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
}

function selectTextFromFile() {
    return new Promise(function(resolve, reject) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/*';

        input.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileContent = e.target.result.replace('END_PACKET', '');
                    resolve(fileContent);
                };
                reader.readAsText(file);
            } else {
                reject(new Error('No file selected.'));
            }
        });
        input.click();
    });
}

function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
}


