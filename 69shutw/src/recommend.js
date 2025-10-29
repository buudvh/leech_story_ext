// load('libs.js');
// load('config.js');

// function execute(raw) {
//     try {
//         var data = [];
//         var doc = Html.parse(raw);

//         var elms = doc.select('.searchresult');

//         if (!elms.length) throw new Error("Length = 0");

//         // throw new Error("Length=" + elms.length);

//         elms.forEach(function (e) {
//             data.push({
//                 name: convertT2S(e.select('h3').first().text()), //e.select('a:nth-child(2)').text(),
//                 link: e.select('div::nth-child(2) a').first().attr('href'),
//                 cover: e.select('img').first().attr('href') || DEFAULT_COVER,
//                 description: convertT2S(e.select('div:nth-child(2) > p:nth-child(2) > span').text()),
//                 host: BASE_URL
//             })
//         });

//         return Response.success(data);
//     } catch (error) {
//         // return Response.error(error.message);
//         return Response.success([
//             {
//                 name: error.message, //e.select('a:nth-child(2)').text(),
//                 link: 'https://www.69shu.tw/book/5272774.html',
//                 cover: 'https://cdn.69shu.tw/5272/5272774/5272774s.jpg',
//                 description: convertT2S('時運不濟，開局勇闖紅樓世界 這不是有係統嗎？馬上給我起飛。...'),
//                 host: BASE_URL
//             }
//         ]);
//     }
// }

load('config.js');
load('libs.js');

function execute(data) {
    try {
        let doc = Html.parse(data);
        // var response = fetch(url);
        // if (!response.ok) throw new Error(`Status ${response.status}`);

        // var doc = response.html();
        let reviews = [];

        let reviewElms = doc.select(".searchresult");

        if (!reviewElms.length) throw new Error(`Không có reviews`);

        reviewElms.forEach(function (e) {
            reviews.push({
                name: convertT2S(e.select('h3').first().text()),
                link: e.select('div::nth-child(2) a').first().attr('href'),
                cover: e.select('img').first().attr('src') || DEFAULT_COVER,
                description: convertT2S(e.select('div:nth-child(2) > p:nth-child(2) > span').text()),
                host: BASE_URL
            });
        });

        return Response.success(reviews);
    } catch (error) {
        // return Response.error(`${error.message}`);
        return Response.success([
            {
                name: error.message, //e.select('a:nth-child(2)').text(),
                link: 'https://www.69shu.tw/book/5272774.html',
                cover: 'https://cdn.69shu.tw/5272/5272774/5272774s.jpg',
                description: convertT2S('時運不濟，開局勇闖紅樓世界 這不是有係統嗎？馬上給我起飛。...'),
                host: BASE_URL
            }
        ]);
    }
}
