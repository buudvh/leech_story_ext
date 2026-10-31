function execute(url) {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    
    var probeScript = "(function() {\n" +
        // XHR đọc chương của trang (biến toàn cục chapterfetcher): mã khác 0 là lỗi của STV, không phải đang tải.
        // 7 = thiếu cookie (trang tự tải lại), 15 = trang tự chuyển hướng, 21 = captcha của STV (chờ người dùng giải).
        "    var xhr = window.chapterfetcher;\n" +
        "    if (xhr && xhr.readyState === 4 && xhr.responseText) {\n" +
        "        var raw = xhr.responseText, x = null;\n" +
        "        try { x = JSON.parse(raw); } catch (e) {\n" +
        "            try { x = JSON.parse(raw.substring(raw.indexOf('{\"'))); } catch (e2) {}\n" +
        "        }\n" +
        "        var code = (x && x.code !== undefined && x.code !== null) ? String(x.code) : '0';\n" +
        "        if (code === '21') {\n" +
        "            return JSON.stringify({ ready: false, failed: false, reason: 'captcha' });\n" +
        "        }\n" +
        "        if (code !== '0' && code !== '7' && code !== '15') {\n" +
        "            return JSON.stringify({ ready: false, failed: true, reason: 'code ' + code + ': ' + (x.err || x.info || '') });\n" +
        "        }\n" +
        "    }\n" +
        "    var node = document.querySelector('#maincontent') || document.querySelector('#content-container .contentbox') || document.querySelector('.contentbox');\n" +
        "    if (!node) {\n" +
        "        return JSON.stringify({ ready: false, failed: false, reason: 'Content node not found' });\n" +
        "    }\n" +
        "    var nameholder = document.querySelector('#bookchapnameholder');\n" +
        "    var title = nameholder ? nameholder.textContent.trim() : '';\n" +
        "    if (!title || title === '_') {\n" +
        "        return JSON.stringify({ ready: false, failed: false, reason: 'Title is still placeholder' });\n" +
        "    }\n" +
        "    var text = node.textContent;\n" +
        "    if (text.indexOf('Tải quá thời gian') >= 0 || text.indexOf('Tải chương thất bại') >= 0) {\n" +
        "        return JSON.stringify({ ready: false, failed: true, reason: 'Loading timeout or failed error' });\n" +
        "    }\n" +
        "    if (text.indexOf('Đang tải nội dung chương') >= 0 || text.indexOf('Đang tải...') >= 0) {\n" +
        "        return JSON.stringify({ ready: false, failed: false, reason: 'Content is loading' });\n" +
        "    }\n" +
        "    if (document.body.textContent.indexOf('502 Bad Gateway') >= 0 || document.body.textContent.indexOf('503 Service') >= 0) {\n" +
        "        return JSON.stringify({ ready: false, failed: true, reason: 'Fatal gateway or service error' });\n" +
        "    }\n" +
        "    var hasSpinner = node.querySelector('.spinner-border, .loading, #loading-container') !== null;\n" +
        "    if (hasSpinner) {\n" +
        "        return JSON.stringify({ ready: false, failed: false, reason: 'Spinner/loading present' });\n" +
        "    }\n" +
        "    var encoded = node.querySelectorAll('i[t]').length;\n" +
        "    var clone = node.cloneNode(true);\n" +
        "    clone.querySelectorAll('script, style, noscript, button, iframe, .spinner-border').forEach(function(el) { el.remove(); });\n" +
        "    var textLength = clone.textContent.trim().length;\n" +
        // "    var isReady = (encoded > 0) || (textLength >= 20);\n" +
        // "    if (!isReady) {\n" +
        // "        return JSON.stringify({ ready: false, failed: false, reason: 'Content too short' });\n" +
        // "    }\n" +
        "    return JSON.stringify({\n" +
        "        ready: true,\n" +
        "        failed: false,\n" +
        "        reason: '',\n" +
        "        chars: textLength,\n" +
        "        encoded: encoded\n" +
        "    });\n" +
        "})()";

    var extractionScript = "(function() {\n" +
        "    var node = document.querySelector('#maincontent') || document.querySelector('#content-container .contentbox') || document.querySelector('.contentbox');\n" +
        "    if (!node) return '';\n" +
        "\n" +
        "    function cleanSpaces(value) {\n" +
        "        return (value || '')\n" +
        "            .replace(/\\u00a0/g, ' ')\n" +
        "            .replace(/[ \\t]+\\n/g, '\\n')\n" +
        "            .replace(/\\n[ \\t]+/g, '\\n')\n" +
        "            .replace(/\\n{3,}/g, '\\n\\n')\n" +
        "            .trim();\n" +
        "    }\n" +
        "\n" +
        "    var encoded = node.querySelectorAll('i[t]').length;\n" +
        "    if (encoded > 0) {\n" +
        "        var parts = [];\n" +
        "        var blockTags = {\n" +
        "            'P': true, 'DIV': true, 'CENTER': true, 'H1': true,\n" +
        "            'H2': true, 'H3': true, 'H4': true, 'LI': true\n" +
        "        };\n" +
        "\n" +
        "        function isIgnoredSpan(element) {\n" +
        "            if (element.tagName !== 'SPAN') return false;\n" +
        "            var text = cleanSpaces(element.textContent);\n" +
        "            var title = cleanSpaces(element.getAttribute('title') || '');\n" +
        "            return (\n" +
        "                text === '@Bạn đang đọc bản lưu trong hệ thống' ||\n" +
        "                (/^ID:\\s*\\d+$/i.test(title) && /^Người mua:/i.test(text)) ||\n" +
        "                (/^ID:\\s*\\d+$/i.test(title) && /^Nguoi mua:/i.test(text))\n" +
        "            );\n" +
        "        }\n" +
        "\n" +
        "        function appendBreak() {\n" +
        "            var last = parts[parts.length - 1] || '';\n" +
        "            if (last.charAt(last.length - 1) !== '\\n') parts.push('\\n');\n" +
        "        }\n" +
        "\n" +
        "        function walk(current) {\n" +
        "            if (!current) return;\n" +
        "            if (current.nodeType === 3) {\n" +
        "                var text = (current.textContent || '').replace(/[\\s\\u00a0]+/g, '');\n" +
        "                if (text) parts.push(text);\n" +
        "                return;\n" +
        "            }\n" +
        "            if (current.nodeType === 1) {\n" +
        "                var tagName = current.tagName;\n" +
        // BUTTON: nút "Nội dung không đầy đủ?, nhấp để hệ thống tải lại." trang chèn vào chương ngắn
        "                if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT' || tagName === 'IFRAME' || tagName === 'BUTTON') {\n" +
        "                    return;\n" +
        "                }\n" +
        "                if (current.hidden || current.getAttribute('aria-hidden') === 'true') {\n" +
        "                    return;\n" +
        "                }\n" +
        "                if (isIgnoredSpan(current)) {\n" +
        "                    return;\n" +
        "                }\n" +
        "                if (tagName === 'BR') {\n" +
        "                    appendBreak();\n" +
        "                    return;\n" +
        "                }\n" +
        "                if (tagName === 'I' && current.hasAttribute('t')) {\n" +
        "                    var t = cleanSpaces(current.getAttribute('t') || '');\n" +
        "                    if (t) parts.push(t);\n" +
        "                    return;\n" +
        "                }\n" +
        "                var childNodes = current.childNodes;\n" +
        "                for (var i = 0; i < childNodes.length; i++) {\n" +
        "                    walk(childNodes[i]);\n" +
        "                }\n" +
        "                if (blockTags[tagName]) appendBreak();\n" +
        "            }\n" +
        "        }\n" +
        "        walk(node);\n" +
        "        return cleanSpaces(parts.join(''));\n" +
        "    } else {\n" +
        "        var clone = node.cloneNode(true);\n" +
        "        clone.querySelectorAll('script, style, noscript, button, iframe, .spinner-border').forEach(function(item) { item.remove(); });\n" +
        "        clone.querySelectorAll('[hidden], [aria-hidden=\"true\"]').forEach(function(item) { item.remove(); });\n" +
        "        clone.querySelectorAll('br').forEach(function(br) { br.parentNode.replaceChild(document.createTextNode('\\n'), br); });\n" +
        "        clone.querySelectorAll('p, div, center, h1, h2, h3, h4, li').forEach(function(block) {\n" +
        "            block.appendChild(document.createTextNode('\\n'));\n" +
        "        });\n" +
        "        return cleanSpaces(clone.textContent);\n" +
        "    }\n" +
        "})()";

    var browser = Engine.newVisibleBrowser("Tải chương");
    var finalResult = "";
    try {
        browser.launch(url, 30000);
        var state = browser.waitForReady(probeScript, 20000, 250, 2);

        // Hết giờ vì captcha: giữ trình duyệt mở thêm 60 s cho người dùng giải, không gọi gotox()
        var isCaptcha = !state.ready && state.timedOut === true && probeReason(browser, probeScript) === "captcha";
        if (isCaptcha) {
            console.log("⚠️ STV yêu cầu captcha, chờ người dùng giải trong trình duyệt...");
            state = browser.waitForReady(probeScript, 60000, 500, 2);
        }

        if (!state.ready && !isCaptcha) {
            var reason = state.reason || "";
            var isRetriable = state.timedOut === true || reason.indexOf("Loading timeout or failed error") >= 0;

            if (isRetriable) {
                console.log("⚠️ Chapter not ready, calling gotox() to retry...");
                browser.callJs("if (typeof gotox === 'function') { gotox(); }", 0);
                state = browser.waitForReady(probeScript, 20000, 250, 2);
            }
        }

        if (state.ready) {
            finalResult = browser.callJs(extractionScript, 0);
        } else if (isCaptcha && state.timedOut === true) {
            return Response.error("STV yêu cầu xác minh captcha. Hãy giải captcha trong trình duyệt \"Tải chương\" rồi tải lại chương.");
        } else {
            return Response.error("Không thể tải nội dung chương truyện. Lý do: " + readableReason(state.reason));
        }
    } finally {
        browser.close();
    }
    
    // if (!finalResult || finalResult.length < 20) {
    //     return Response.error("Nội dung chương sau trích xuất quá ngắn hoặc rỗng (" + (finalResult ? finalResult.length : 0) + " ký tự)");
    // }
    if (finalResult.indexOf("Đang tải nội dung chương") >= 0 || finalResult.indexOf("Tải quá thời gian") >= 0 || finalResult.indexOf("Tải chương thất bại") >= 0 || finalResult.indexOf("Đang tải...") >= 0) {
        return Response.error("Nội dung trích xuất chứa văn bản tạm thời/lỗi.");
    }
    return Response.success(finalResult);
}

// waitForReady hết giờ chỉ trả lý do chung ⇒ chạy probe thêm một lần để biết trang đang chờ gì
function probeReason(browser, probeScript) {
    try {
        return JSON.parse(browser.callJs(probeScript, 0) || "{}").reason || "";
    } catch (e) {
        return "";
    }
}

function readableReason(reason) {
    var match = /^code (\d+): ?([\s\S]*)$/.exec(reason || "");
    if (!match) return reason || "Hết thời gian chờ";
    var hint = (match[1] === "12" || match[1] === "13") ? " (cần đăng nhập/mua chương trên STV)" : "";
    return "STV báo lỗi mã " + match[1] + hint + (match[2] ? ": " + match[2] : "");
}
