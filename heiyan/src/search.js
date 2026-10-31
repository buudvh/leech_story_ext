load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = SEARCH_API + '?queryString=' + encodeURIComponent(key) + '&highlight=false&page=' + page;
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var json = response.json();
        var content = (json && json.data && json.data.content) || [];
        var data = [];
        content.forEach(function (e) {
            data.push({
                name: stripTags(e.name),
                link: BASE_URL + '/book/' + e.id,
                cover: heiyanCover(e.iconUrlSmall),
                description: '作者: ' + (e.authorname || '') + ' | ' + (e.sortname || '')
                    + (e.lastchaptername ? '\n最新: ' + e.lastchaptername : ''),
                host: BASE_URL
            });
        });

        var hasNext = json && json.data && json.data.last === false && data.length > 0;
        return Response.success(data, hasNext ? (parseInt(page, 10) + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}

function stripTags(text) {
    return String(text || '').replace(/<[^>]+>/g, '').trim();
}
