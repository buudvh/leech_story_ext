load('libs.js');
load('config.js');
load('stv.js');

//https://www.idejian.com/catelog/13438991/1?page=1

function execute(url) {
    try {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var data = response.json();

        if (data.code != 0) throw new Error(`Code = ${data.code}`);

        var doc = Html.parse(data.html);
        var elms = doc.select('a');
        var result = [];

        elms.forEach(e => {
            result.push({
                name: e.text().formatTocName(),
                url: e.attr('href'),
                host: BASE_URL,
            })
        });

        // data = data.reverse();

        return Response.success(result);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
