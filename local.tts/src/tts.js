function execute(text, voice) {
    try {
        const speed = parseFloat(SPEED) || 0;
        let response = fetch(`${BASE_URL}/v1/tts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                voice: voice,
                speed: speed
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
