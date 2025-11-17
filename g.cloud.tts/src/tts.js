load("voice_list.js");

function execute(text, voice) {
    try {
        let apiKey = localStorage.getItem("apiKey");

        if(!apiKey) throw new Error("Vui lòng bỏ apiKey vào localstorage");

        let response = fetch("https://readaloud.googleapis.com/v1:generateAudioDocStream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
                "text": {
                    "textParts": text
                },
                "advanced_options": {
                    "force_language": "vi",
                    "audio_generation_options": {
                        "speed_factor": 1,
                        "pitch_factor": 1
                    }
                },
                "voice_settings": {
                    "voice_criteria_and_selections": [
                        {
                            "criteria": { "language": "vi" },
                            "selection": { "default_voice": voice }
                        }
                    ]
                }
            })
        });

        if (!response.ok) throw new Error("Status = " + response.status);

        let data = response.json();
        // Return base64
        return Response.success(data[2]["audio"]["bytes"]);
    } catch (error) {
        return Response.error(error.message);
    }
}