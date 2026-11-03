load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var htm = doc.select("#container > div.mybox > div.txtnav");
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

// Dòng quảng cáo trang chèn vào nội dung ("實時更新，請訪問sto9.𝙘𝙤𝙢", "s🎶to9.com為您提供…", "閱讀更多內容，盡在sto9🍍.com"):
// tên miền bị trộn emoji / chữ toán học Unicode. Chuẩn hoá NFKC, bỏ mọi ký tự ngoài chữ Hán, a-z, 0-9 và dấu chấm;
// dòng ngắn (≤ 40 ký tự còn lại) có "sto9.com" / "sto9com" ⇒ bỏ cả dòng. Dòng dài để nguyên (truyện lỡ nhắc tên trang).
function removeSiteWatermarks(html) {
    return html.split(/<br\s*\/?>/i).filter(function (line) {
        var key = line.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').normalize('NFKC').toLowerCase()
            .replace(/[^一-鿿a-z0-9.]/g, '');
        return !(key.length > 0 && key.length <= 40 && /sto9\.?com/.test(key));
    }).join('<br>');
}
