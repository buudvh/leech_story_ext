load('libs.js');
load('config.js');
load('tongWen.js');

function execute(url, page) {
    page = page || '1';
    url = String.format(BASE_URL + url, page);

    try {
        let response = fetch(url);
        if (response.ok) {
            let json = response.json();
            let stories = json.data;
            let data = [];

            if (!stories.length) return Response.error(url + "  Empty");

            for (let i = 0; i < stories.length; i++) {
                data.push({
                    name: TongWen.toSimplified(stories[i].title),
                    link: BASE_URL + stories[i].infourl,
                    cover: BASE_URL + stories[i].coverUrl,
                    description: TongWen.toSimplified(stories[i].description),
                    host: BASE_URL
                });
            }

            var next = parseInt(page, 10) + 1;
            return Response.success(data, next.toString());
        }
        return Response.error("Status: " + response.status + " " + url);
    } catch (error) {
        return Response.error(url + " " + error.message);
    }
}