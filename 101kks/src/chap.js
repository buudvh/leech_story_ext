load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var htm = doc.select("#txtcontent");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = htm.cleanHtml();
        htm = htm.replace(/<br\s*\/?>[^<]*?(?:101看书网|看書就來)[^<]*?(?=<br\s*\/?>)/gi, '');
        htm = removeSiteWatermarks(htm);

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}

// Dòng quảng cáo trang chèn vào nội dung, tên miền trộn chữ toán học / chữ hoa nhỏ Unicode: "記住我們101看書網",
// "101看書𝟷𝟶𝟷ᴋᴋs.ᴄᴏᴍ全手打無錯站", "…讀小說就上 101 看書網，𝟣𝟢𝟣𝗄𝗄𝗌.𝖼𝗈𝗆超順暢", "…域名101𝒌𝒌𝒔.𝒄𝒐𝒎".
// Chuẩn hoá NFKC (chữ toán học, toàn khổ), đổi chữ hoa nhỏ / chữ Kirin trông giống Latin (NFKC không đổi), bỏ mọi ký tự
// ngoài chữ Hán, a-z, 0-9 và dấu chấm; dòng ngắn (≤ 50 ký tự còn lại) có "101kks.com" / "101看書網" / "看書就來" (phồn
// hoặc giản) ⇒ bỏ cả dòng. Dòng dài để nguyên (truyện lỡ nhắc tên trang). Cùng cách với sto9.
var LOOKALIKE_LETTERS = {
    'ᴀ': 'a', 'ʙ': 'b', 'ᴄ': 'c', 'ᴅ': 'd', 'ᴇ': 'e', 'ꜰ': 'f', 'ɢ': 'g', 'ʜ': 'h', 'ɪ': 'i', 'ᴊ': 'j', 'ᴋ': 'k',
    'ʟ': 'l', 'ᴍ': 'm', 'ɴ': 'n', 'ᴏ': 'o', 'ᴘ': 'p', 'ǫ': 'q', 'ʀ': 'r', 'ꜱ': 's', 'ᴛ': 't', 'ᴜ': 'u', 'ᴠ': 'v',
    'ᴡ': 'w', 'ʏ': 'y', 'ᴢ': 'z',
    'а': 'a', 'с': 'c', 'е': 'e', 'к': 'k', 'м': 'm', 'о': 'o', 'р': 'p', 'ѕ': 's', 'х': 'x'
};

function removeSiteWatermarks(html) {
    return html.split(/<br\s*\/?>/i).filter(function (line) {
        var key = line.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').normalize('NFKC').toLowerCase()
            .replace(/[\s\S]/g, function (ch) { return LOOKALIKE_LETTERS[ch] || ch; })
            .replace(/[^一-鿿a-z0-9.]/g, '');
        return !(key.length > 0 && key.length <= 50 && /101kks\.?com|101看[书書][网網]|看[书書]就[来來]/.test(key));
    }).join('<br>');
}
