load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var data = [];
        var response = crawler.get(url, {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var json = response.json();
        var items = json.items;

        if (!items.length) throw new Error(`Length = 0`);

        items.forEach(e => {
            data.push({
                name: e.name,
                link: `/novel/chapters/${e.novel_id}`,
                cover: `https://static.ttkan.co/cover/${e.topic_img}`,
                description: e.description,
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}