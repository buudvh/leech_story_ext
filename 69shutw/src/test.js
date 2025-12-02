load('libs.js');
load('config.js');

function execute(raw) {
    try {
        return Response.success([
            {
                name: "諸天：開局紅樓勇闖天涯".convertT2S(), //e.select('a:nth-child(2)').text(),
                link: 'https://www.69shu.tw/book/5272774.html',
                cover: 'https://cdn.69shu.tw/5272/5272774/5272774s.jpg',
                description: '時運不濟，開局勇闖紅樓世界 這不是有係統嗎？馬上給我起飛。...'.convertT2S(),
                host: BASE_URL
            }
        ]);
    } catch (error) {
        return Response.success([
            {
                name: error.message, //e.select('a:nth-child(2)').text(),
                link: 'https://www.69shu.tw/book/5272774.html',
                cover: 'https://cdn.69shu.tw/5272/5272774/5272774s.jpg',
                host: BASE_URL
            }
        ]);
    }
}