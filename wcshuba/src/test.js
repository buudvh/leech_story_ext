load('libs.js');
load('config.js');

function execute(url) {
    return Response.success([
        {
            name: '开局金风细雨楼主，一刀惊天下'.convertT2S(),
            link: 'https://wcshuba.com/book/2827.html',
            cover: 'https://pic.wcshuba.com/2/2827/2827s.webp',
            host: BASE_URL
        }
    ]);
}