var host69yuedu = 'http://23.225.121.243';
function getChap69yuedu(url) {
    let text = '';
    let rid = url.replace(host69yuedu, "").replace(".html", "")
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var htm = $.Q(doc, '#content', { remove: ['h1', 'div'] }).html();

        text += cleanHtml(htm.replace(/<h1.*?>.*?<\/h1>/g, ''))
            .replace(/^ *第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');
    }
    let url2 = host69yuedu + rid + "_2.html";
    response = fetch(url2);
    if (response.ok) {
        let doc = response.html();
        var htm = $.Q(doc, '#content', { remove: ['h1', 'div'] }).html();

        text += cleanHtml(htm.replace(/<h1.*?>.*?<\/h1>/g, ''))
            .replace(/^ *第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');
    }
    return text.replace(/<br\s*\/?>|\n/g, "<br><br>");
}
function getToc69yuedu(url) {
    let pageList = getListPageToc(url);
    var data = [];
    pageList.forEach(function (e) {
        data = data.concat(getTocInEachMenuPage(e));
    });
    return data;
}

function getTocInEachMenuPage(url) {
    let response = fetch(url);
    var data = [];
    if (response.ok) {
        let doc = response.html();
        var elems = doc.select('div.section-box');
        var count = 0;
        elems.forEach(function (e) {
            if(count > 0){
                var elems = e.select('a');
                elems.forEach(function (e) {
                    data.push({
                        name: formatName(e.text()),
                        url: e.attr('href'),
                        host: host69yuedu
                    })
                });
            }

            count++;
        })
    }
    return data;
}

function getListPageToc(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();;
        var data = [];
        var menu = doc.select("div.listpage > span.middle > select").first();
        menu.select("option").forEach(function (e) {
            data.push(host69yuedu + e.attr("value"));
        });
        return data;
    }
}

function formatName(name) {
    var re = /^(\d+)\.第(\d+)章/;
    return name.replace(re, '第$2章');
}
function getDetail69yuedu(url) {
    let response = fetch(url);
    let doc = response.html();
    let data = {
        name: doc.select("div.info > div > h1").html() || 'No name',
        cover: doc.select("div.imgbox > img").attr("src") || "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg",
        author: doc.select("div.fix > p:nth-child(1)").html().replace('作者：', '') || 'Unknow',
        description: doc.select("div.desc").html() || '',
        detail: $.QA(doc, 'div.fix p', { m: x => x.text(), j: '<br>' }) || '',
    }
    return data;
}