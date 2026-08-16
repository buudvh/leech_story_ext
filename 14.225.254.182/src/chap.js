function execute(url) {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    
    var probeScript = "(function() {\n" +
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
        "    var isReady = (encoded > 0) || (textLength >= 20);\n" +
        "    if (!isReady) {\n" +
        "        return JSON.stringify({ ready: false, failed: false, reason: 'Content too short' });\n" +
        "    }\n" +
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
        "                if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT' || tagName === 'IFRAME') {\n" +
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
        
        if (!state.ready) {
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
        } else {
            return Response.error("Không thể tải nội dung chương truyện. Lý do: " + (state.reason || "Hết thời gian chờ"));
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
