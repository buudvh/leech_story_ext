load('common.js');

function getChapQidian(url) {
    var response = fetch(url, {
        headers: { 'user-agent': UserAgent.android() } // giả lập trình duyệt di động
    });

    var doc = response.html();
    var html = doc.select('.content').html();

    // Nếu muốn thêm lời tác giả:
    // var authorSay = doc.select('.author-say p').first() ? doc.select('.author-say p').first().html() : null;
    // if (authorSay) html += "<br><br>PS:<br><br>" + authorSay;

    // Chuẩn hóa <br> để hiển thị đẹp hơn
    return html.replace(/<br\s*\/?>|\n/g, '<br><br>');
}


function getTocQidian(url) {
    var idBook = url.match(/\d+/g)[1];
    var response = fetch("https://m.qidian.com/book/" + idBook + "/catalog/", {
        headers: { 'user-agent': UserAgent.android() }
    });

    var doc = response.html();
    var scriptContent = doc
        .select('#vite-plugin-ssr_pageContext')
        .html()
        .replace(/<\/?script.*?>/g, '');

    var json = JSON.parse(scriptContent);
    var chapters = [];

    var volumeList = json.pageContext.pageProps.pageData.vs;
    for (var i = 0; i < volumeList.length; i++) {
        var volume = volumeList[i];
        for (var j = 0; j < volume.cs.length; j++) {
            var chap = volume.cs[j];
            chapters.push({
                name: formatName(chap.cN),
                url: "https://m.qidian.com/chapter/" + idBook + "/" + chap.id + "/",
                pay: chap.sS !== 1 // true nếu là chương VIP
            });
        }
    }

    return chapters;
}


function getDetailQidian(url) {
    var idBook = url.match(/\d+/g)[1];
    var bookUrl = "https://www.qidian.com/book/" + idBook + "/";

    var response = fetch(bookUrl);
    if (!response.ok) return null;

    var doc;
    if (response.status === 202) {
        var browser = Engine.newBrowser();
        browser.launch(bookUrl, 15 * 1000); // timeout 15 giây
        doc = browser.html();
    } else {
        doc = response.html();
    }

    var cover = "https:" + $.Q(doc, '#bookImg img').attr('src');
    var author = doc.select('meta[property="og:novel:author"]').attr("content");

    var comments = [{
        title: "评论",
        input: idBook,
        script: "comment.js"
    }];

    return {
        name: doc.select('#bookName').text(),
        cover: cover,
        author: author,
        description: doc.select('#book-intro-detail').html(),
        host: STVHOST,
        comments: comments
    };
}
