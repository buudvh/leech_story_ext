load('libs.js');
load('config.js');


function execute(url) {
    let response = fetch(url);
    if (!response.ok) return null;

    let doc = response.html('gb2312');
    let author = $.QA(doc, '#content table table td', { f: x => /作.*者：/.test(x.text()), m: x => x.text().replace(/作.*者：/, '').replace('<br', '').trim(), j: ' ' });
    let category = $.QA(doc, '#content table table td', { f: x => /类.*别：/.test(x.text()), m: x => x.text().replace(/类.*别：/, '').replace('<br', '').trim(), j: ' ' });
    let cover = doc.select('#content table table a > img[align][hspace][vspace]').first().attr('src');
    let description = $.Q(doc, '#content table table div[style]:not([id]):not([onclick])', { remove: 'span, a' }).html();
    var detail = $.QA(doc, '#content > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td', { m: function (x) { return x.text(); }, j: '<br>' });
    description = cleanHtml(description);

    var categories = {
        '玄幻魔法': '/booksort1/0/{0}.html',
        '武侠修真': '/booksort2/0/{0}.html',
        '都市言情': '/booksort3/0/{0}.html',
        '历史军事': '/booksort4/0/{0}.html',
        '网游竞技': '/booksort5/0/{0}.html',
        '科幻小说': '/booksort6/0/{0}.html',
        '恐怖灵异': '/booksort7/0/{0}.html',
        '同人漫画': '/booksort8/0/{0}.html',
        '其他类型': '/booksort9/0/{0}.html',
    };

    return Response.success({
        name: $.Q(doc, '#content h1').text(),
        cover: cover,
        author: author,
        description: description,
        detail: detail,
        host: BASE_URL,
        genres: [
            {
                title: category,
                input: categories[category],
                script: "gen.js"
            }
        ]
    });
}