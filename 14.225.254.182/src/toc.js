load('common.js');

function execute(url) {
    var ajaxUrl = '';
    try {
        var baseUrl = stvBase();

        // Parse sourceHost and bookId from URL
        var match = url.match(/\/truyen\/([^\/]+)\/1\/([^\/?#]+)/);
        if (!match) {
            match = url.match(/\/truyen\/([^\/]+)\/[^\/]+\/([^\/?#]+)/);
        }
        if (!match) {
            throw new Error("URL truyện không hợp lệ hoặc sai định dạng");
        }
        var sourceHost = match[1];
        var bookId = match[2];

        ajaxUrl = baseUrl + "/index.php?ngmar=chapterlist&h=" + sourceHost + "&bookid=" + bookId + "&sajax=getchapterlist";

        var response = fetch(ajaxUrl, {
            headers: {
                "Referer": url,
                "User-Agent": STV_UA
            }
        });
        if (!response.ok) {
            throw new Error("Status = " + response.status);
        }
        var text = response.text();
        if (!text) {
            throw new Error("Trang không trả mục lục");
        }

        var json = JSON.parse(text);

        // oridata = tên chương tiếng Trung (app tự dịch), data = bản dịch của STV
        var raw = json.oridata || json.data || "";
        if (!raw) {
            throw new Error("Mục lục rỗng hoặc nguồn đã hỏng (code " + json.code + ")");
        }
        var unlocked = json.unlocked || {};

        var chapters = [];
        var rawChapters = raw.split("-//-");
        for (var i = 0; i < rawChapters.length; i++) {
            var part = rawChapters[i].split("-/-");
            if (part.length < 3) continue;

            var volId = part[0].trim();
            var chapId = part[1].trim();
            var title = part[2].replace(/[\t\r\n]+|<br>|&nbsp;/g, "").trim();
            var flag = (part[3] || "").trim();

            var chapUrl = baseUrl + "/truyen/" + sourceHost + "/" + volId + "/" + bookId + "/" + chapId + "/";

            // vip = chương trả phí chưa mở; unvip hoặc có trong unlocked = đã mở khoá
            var isPaid = flag === "vip" || flag === "unvip";
            var isLocked = flag === "vip" && !unlocked.hasOwnProperty(chapId);
            var icon = isLocked ? " 🔒︎" : (isPaid ? " 🔑︎" : "");

            chapters.push({
                name: title + icon,
                url: chapUrl,
                host: baseUrl,
                lock: isLocked,
                pay: isPaid
            });
        }

        return Response.success(chapters);
    } catch (error) {
        return Response.error(`Url: ${ajaxUrl}\nMessage:${error.message}`);
    }
}
