load('common.js');

function execute(input, pageUrl) {
    var endpoint = stvAbsolute(pageUrl || input || "");
    if (!endpoint) {
        return Response.error("Thiếu URL danh sách truyện");
    }

    var response = fetch(endpoint, {
        method: "POST",
        headers: {
            "Referer": stvBase() + "/",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": STV_UA,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "ignores="
    });
    if (!response.ok) {
        return Response.error("Url: " + endpoint + "\nStatus: " + response.status);
    }

    var results = stvParseBooks(response.html());

    var nextPage = null;
    if (results.length >= 48) {
        var pageMatch = endpoint.match(/([?&]p=)(\d+)/);
        if (pageMatch) {
            var nextNumber = parseInt(pageMatch[2], 10) + 1;
            nextPage = endpoint.replace(pageMatch[0], pageMatch[1] + nextNumber);
        }
    }

    return Response.success(results, nextPage);
}
