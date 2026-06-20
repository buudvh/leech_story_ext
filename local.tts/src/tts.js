function execute(text, voice) {
    try {
        let response = fetch("http://127.0.0.1:17771/v1/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                voice: voice,
                speed: 1.0
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
            throw new Error("Lỗi máy chủ LocalTTS: HTTP " + response.status + " - " + errText);
        }

        // Trả về dữ liệu âm thanh dạng base64
        return Response.success(response.base64());
    } catch (error) {
        return Response.error(error.message);
    }
}
