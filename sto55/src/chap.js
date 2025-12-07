load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var htm = doc.select('.readcotent');
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();
        htm.select('script').remove();

        htm = htm.html();
        htm = removeSto55Lines(htm);
        htm = htm.cleanHtml();

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

// function removeSto55Lines(html) {
//     // Tách thành từng dòng theo <br>
//     const lines = html.split(/<br\s*\/?>/i);

//     // Chuẩn hóa toàn bộ ký tự unicode về dạng "thường dân" nhất
//     const normalize = s => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

//     // Regex tìm "sto55.com" sau khi normalize
//     const pattern = /sto\s*55\s*\.?\s*com/i;

//     // Giữ lại các dòng không chứa biến thể sto55.com
//     const filtered = lines.filter(line => {
//         const norm = normalize(line).replace(/[^\x00-\x7F]/g, "");
//         return !pattern.test(norm);
//     });

//     // Ghép lại thành HTML với <br>
//     return filtered.join("<br>");
// }

function removeSto55Lines(html) {
    var lines = html.split(/<br\s*\/?>/i);

    // Bảng chuyển Unicode → ASCII
    var map = {
        // s
        'ѕ': 's', '𝑠': 's', '𝗌': 's', '𝘀': 's', '𝓈': 's', '𝘴': 's',
        '𝒮': 's', '𝐬': 's', '𝐒': 's', '𝕤': 's', '𝕊': 's',

        // t
        'τ': 't', 'ᴛ': 't', '𝘁': 't', '𝓉': 't', '𝐭': 't', '𝐓': 't',
        '𝑡': 't', '𝒯': 't', '𝕥': 't', '𝕋': 't',

        // o
        'о': 'o', '𝑜': 'o', '𝗈': 'o', '𝘰': 'o', '𝓸': 'o', '𝒪': 'o',
        '𝐨': 'o', '𝐎': 'o', '𝕠': 'o', '𝕆': 'o',

        // 5
        '𝟝': '5', '𝟧': '5', '𝟻': '5',
        '⓹': '5', '➄': '5', '➎': '5',

        // dấu chấm
        '．': '.',

        // c
        'ᴄ': 'c', '𝒞': 'c', '𝐜': 'c', '𝐂': 'c', '𝕔': 'c', '𝕮': 'c',

        // m
        'ᴍ': 'm', '𝗺': 'm', '𝘮': 'm', '𝓶': 'm', '𝐦': 'm', '𝐌': 'm'
    };

    function normalize(str) {
        if (str.normalize) {
            str = str.normalize("NFKD");
        }
        var out = "";
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            out += map[ch] ? map[ch] : ch;
        }
        return out;
    }

    // Regex nhận dạng sto55.com sau khi normalize
    var pattern = /s\s*t\s*o\s*5\s*5\s*\.?\s*c\s*o\s*m/i;

    var filtered = [];
    for (var i = 0; i < lines.length; i++) {
        var norm = normalize(lines[i]);
        if (!pattern.test(norm)) {
            filtered.push(lines[i]);
        }
    }

    return filtered.join("<br>");
}
