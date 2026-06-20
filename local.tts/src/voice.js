load("voice_list.js");

function execute() {
    try {
        let response = fetch("http://127.0.0.1:17771/v1/voices");
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
        // Trả về danh sách dự phòng nếu máy chủ nội bộ chưa khởi động
    }
    return Response.success(voices);
}
