load("language_list.js");
load("apikey.js");
load("prompt.js");

var currentKeyIndex = 0;

function callGroqAPI(text, prompt, apiKey) {
    if (!apiKey) { return { status: "error", message: "API Key không hợp lệ." }; }
    if (!text || text.trim() === '') { return { status: "success", data: "" }; }
    var full_prompt = prompt + "\n\n---\n\n" + text;
    var url = "https://api.groq.com/openai/v1/chat/completions";
    var body = {
        "model": "meta-llama/llama-4-maverick-17b-128e-instruct",
        "messages": [
            {
                "role": "user",
                "content": full_prompt,
            }
        ]
    };
    var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
    }
    try {
        var response = fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) });
        if (response.ok) {
            var result = JSON.parse(response.text());
            if (result && result.choices && result.choices.length > 0) {
                var translatedText = "";
                for (var i = 0; i < result.choices.length; i++) {
                    translatedText += result.choices[i].message.content;
                }
                return { status: "success", translatedText };
            }

            return { status: "error", message: "API không trả về nội dung hợp lệ. Phản hồi: " + response.text() };
        } else {
            return { status: "key_error", message: "Lỗi HTTP " + response.status + " (API key có thể sai hoặc hết hạn mức)." };
        }
    } catch (e) {
        return { status: "error", message: "Ngoại lệ Javascript: " + e.toString() };
    }
}

function translateInChunksByLine(text, prompt) {
    var lines = text.split('\n');
    var translatedLines = [];
    var errorOccurred = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.trim() === '') { translatedLines.push(''); continue; }
        var lineTranslated = false;
        for (var j = 0; j < apiKeys.length; j++) {
            var key = apiKeys[currentKeyIndex];
            var result = callGroqAPI(line, prompt, key);
            if (result.status === "success") {
                translatedLines.push(result.data);
                lineTranslated = true;
                break;
            } else if (result.status === "blocked") {
                translatedLines.push("...");
                lineTranslated = true;
                break;
            } else if (result.status === "key_error") {
                currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
            } else {
                translatedLines.push("[LỖI DỊCH DÒNG: " + result.message + "]");
                lineTranslated = true;
                errorOccurred = true;
                break;
            }
        }
        if (!lineTranslated) {
            translatedLines.push("[LỖI: TẤT CẢ API KEY ĐỀU KHÔNG HOẠT ĐỘNG]");
            errorOccurred = true;
        }
    }
    if (errorOccurred) { return { status: "partial_error", data: translatedLines.join('\n') }; }
    return { status: "success", data: translatedLines.join('\n') };
}

function translateSingleChunk(chunkText, prompt) {
    for (var i = 0; i < apiKeys.length; i++) {
        var key = apiKeys[currentKeyIndex];
        var result = callGroqAPI(chunkText, prompt, key);
        if (result.status === "success") { return result; }
        if (result.status === "blocked") { return translateInChunksByLine(chunkText, prompt); }
        if (result.status === "key_error") {
            currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        } else {
            return result;
        }
    }
    return { status: "error", message: "Tất cả các API key đều không hoạt động." };
}

function execute(text, from, to) {
    if (!apiKeys || apiKeys.length === 0 || (apiKeys[0].indexOf("YOUR_GEMINI_API_KEY") !== -1)) {
        return Response.error("Vui lòng cấu hình API key trong file apikey.js.");
    }
    if (!text || text.trim() === '') { return Response.success("?"); }

    var selectedPrompt = prompts[to] || prompts["default"];

    var textChunks = [];
    var CHUNK_SIZE = 5000;
    var MIN_LAST_CHUNK_SIZE = 1000;
    var INPUT_LENGTH_THRESHOLD = 10000;

    if (text.length > INPUT_LENGTH_THRESHOLD) {
        var tempChunks = [];
        for (var i = 0; i < text.length; i += CHUNK_SIZE) {
            tempChunks.push(text.substring(i, i + CHUNK_SIZE));
        }
        if (tempChunks.length > 1 && tempChunks[tempChunks.length - 1].length < MIN_LAST_CHUNK_SIZE) {
            var lastChunk = tempChunks.pop();
            var secondLastChunk = tempChunks.pop();
            tempChunks.push(secondLastChunk + lastChunk);
        }
        textChunks = tempChunks;
    } else {
        textChunks.push(text);
    }

    var finalParts = [];
    for (var k = 0; k < textChunks.length; k++) {
        var chunkResult = translateSingleChunk(textChunks[k], selectedPrompt);

        if (chunkResult.status === 'success' || chunkResult.status === 'partial_error') {
            finalParts.push(chunkResult.data);
        } else {
            var errorString = "\n\n<<<<<--- LỖI DỊCH PHẦN " + (k + 1) + " --->>>>>\n" +
                "Lý do: " + chunkResult.message + "\n" +
                "<<<<<--- KẾT THÚC LỖI --->>>>>\n\n";
            finalParts.push(errorString);
        }
    }

    var intermediateContent = finalParts.join('\n\n');

    var lines = intermediateContent.split('\n');
    var finalOutput = "";
    for (var i = 0; i < lines.length; i++) {
        finalOutput += lines[i] + "\n";
    }

    return Response.success(finalOutput.trim());
}