load('libs.js');
load('config.js');

//https://wechat.idejian.com/api/wechat/subcategory?categoryId=1432&page=2&order=3
function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(WECHAT_URL + url, page);

        var result = [];

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`)

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var data = response.json();

        if (data.code != 0) throw new Error(`Code = ${data.code}`);
        if (!data.body.books && !data.body.books.length) throw new Error("Length = 0");

        data.body.books.forEach(function (e) {
            result.push({
                name: e.bookName,
                link: e.url,
                cover: e.picUrl,
                description: '作者: ' + e.author
                    + "\n" + e.desc,
                host: BASE_URL
            });
        });

        var next = data.body.pageInfo.page + 1;
        return Response.success(result, next.toString());
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}