function selectVideoFromFile() {
    return new Promise(function(resolve, reject) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file) {
                resolve(file);
            } else {
                reject(new Error('No file selected.'));
            }
        });
        input.click();
    });
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

function base64ToUint8Array(base64String) {
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    return uint8Array;
}

function recordScreen() {
    return new Promise(function (resolve, reject) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
            .then(function (stream) {
                var mediaRecorder = new MediaRecorder(stream);
                var chunks = [];
                mediaRecorder.start();
                mediaRecorder.addEventListener("dataavailable", function (event) {
                    chunks.push(event.data);
                });
                mediaRecorder.addEventListener("stop", function () {
                    var blob = new Blob(chunks, { type: "video/mp4" });
                    resolve(blob);
                });
            })
            .catch(function (err) {
                reject(err);
            });
    });
}


function saveTextToFile(text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'filename.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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