function execute(text, voice) {
    try {
        let baseUrl = (typeof BASE_URL !== 'undefined' && BASE_URL) ? BASE_URL : "http://127.0.0.1:23333";
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (!baseUrl.endsWith("/v1")) {
            baseUrl = baseUrl + "/v1";
        }

        let response = fetch(baseUrl + "/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                voice: voice,
                speed: 1.5
            })
        });

        if (!response.ok) {
            let errText = response.text();
            try {
                let errObj = JSON.parse(errText);
                if (errObj && errObj.message) {
                    throw new Error(errObj.message);
                }
            } catch (e) {}
            throw new Error("Lỗi máy chủ VieNeu-TTS: HTTP " + response.status + " - " + errText);
        }

        // Trả về dữ liệu âm thanh dạng base64
        return Response.success(response.base64());
    } catch (error) {
        return Response.error(error.message);
    }
}
