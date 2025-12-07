load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)
        
        var doc = response.html();
        var htm = doc.select("#txtcontent0");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();
        htm.select("script").remove();

        htm = htm.html();
        htm = removeTwkanLines(htm);
        htm = cleanHtml(htm)
            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');

        return Response.success(convertT2S(htm));
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function removeTwkanLines(html) {
    // Tách từng dòng theo <br>
    var lines = html.split(/<br\s*\/?>/i);

    // Bảng chuyển ký tự Latin mở rộng → ASCII
    var map = {
        'ᴛ': 't', 'ᴡ': 'w', 'ᴋ': 'k', 'ᴀ': 'a', 'ɴ': 'n',
        'ᴄ': 'c', 'ᴏ': 'o', 'ᴍ': 'm'
    };

    function normalize(str) {
        // NFKD chỉ hoạt động khi môi trường hỗ trợ normalize; nếu không, giữ nguyên
        if (str.normalize) {
            str = str.normalize("NFKD");
        }

        var result = "";
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            result += map[ch] ? map[ch] : ch;
        }
        return result;
    }

    // Regex nhận dạng TWKAN
    var pattern = /t\s*w\s*k\s*a\s*n/i;

    var filtered = [];
    for (var i = 0; i < lines.length; i++) {
        var norm = normalize(lines[i]);
        if (!pattern.test(norm)) {
            filtered.push(lines[i]);
        }
    }

    return filtered.join("<br>");
}

