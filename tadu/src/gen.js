load('libs.js');
load('config.js');

function execute(input, page) {
    var url;
    try {
        // listContinue đánh trang từ 0 (trang 0 = trang đầu).
        page = page || '0';
        url = BASE_URL + '/' + input + '&page=' + page;
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var json = response.json();
        var content = (json && json.data && json.data.content) || '';
        var data = parseBookList(Html.parse(content));

        if (!data.length) {
            if (page != '0') return Response.success([], '');
            throw new Error('Length = 0');
        }

        var hasNext = json.data.hasData !== false && isTrue(json.data.hasNext);
        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
