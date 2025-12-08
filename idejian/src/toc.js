load('libs.js');
load('config.js');

//https://www.idejian.com/catelog/13438991/1?page=1

function execute(url) {
    try {
        var bookid = getBookId(url);
        url = `${WECHAT_URL}/allcatalog/${bookid}/`;

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var data = response.json();

        if (data.code != 0) throw new Error(`Code = ${data.code}`);

        var result = [];

        data.body.chapterList.forEach(element => {
            result.push({
                name: element.name,
                url: element.url,
                host: BASE_URL,
            })
        });

        return Response.success(result);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
