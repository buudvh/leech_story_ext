load("voice_list.js");

function execute() {
    try {
        let baseUrl = (typeof BASE_URL !== 'undefined' && BASE_URL) ? BASE_URL : "http://127.0.0.1:23333";
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1);
        }
        if (!baseUrl.endsWith("/v1")) {
            baseUrl = baseUrl + "/v1";
        }

        let response = fetch(baseUrl + "/voices");
        if (response.ok) {
            let data = response.json();
            if (data && data.voices && data.voices.length > 0) {
                let dynamicVoices = data.voices.map(function (name) {
                    return {
                        id: name,
                        language: "vi"
                    };
                });
                return Response.success(dynamicVoices);
            }
        }
    } catch (error) {
        // Trả về danh sách dự phòng nếu máy chủ chưa khởi động
    }
    return Response.success(voices);
}
