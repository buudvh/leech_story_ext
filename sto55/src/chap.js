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

function removeSto55Lines(html) {
    // Tách thành từng dòng theo <br>
    const lines = html.split(/<br\s*\/?>/i);

    // Chuẩn hóa toàn bộ ký tự unicode về dạng "thường dân" nhất
    const normalize = s => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");

    // Regex tìm "sto55.com" sau khi normalize
    const pattern = /sto\s*55\s*\.?\s*com/i;

    // Giữ lại các dòng không chứa biến thể sto55.com
    const filtered = lines.filter(line => {
        const norm = normalize(line).replace(/[^\x00-\x7F]/g, "");
        return !pattern.test(norm);
    });

    // Ghép lại thành HTML với <br>
    return filtered.join("<br>");
}
