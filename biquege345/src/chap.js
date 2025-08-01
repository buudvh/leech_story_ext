function execute(url) {
    url = url.replace('m.biquge345.com', 'www.biquge345.com');
    let response = fetch(url);
    let data = "";
    if (response.ok) {
        let doc = response.html();
        let html = cleanHtml(doc.select(".txt").first().html())
                            .replace(/<p>(.*?)<\/p>/g, '$1<br>')
                            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
                            .replace('(本章完)', '')
        data = html;
    }

    if (data !== null && data !== '') 
        return Response.success(data);
    
    return null;
}

function cleanHtml(html) {
    //remove ads
    html = html.replace('<p style="font-weight:bold" ;="">一秒记住【笔趣阁小说网】biquge345.com，更新快，无弹窗！</p>', '');
    // trim br tags
    html = html.replace(/(^(<br>\s*)+|(<br>\s*)+$)/gm, '');
    // remove duplicate br tags
    html = html.replace(/(<br>\s*){2,}/gm, '<br>');
    // strip html comments
    html = html.replace(/<!--[^>]*-->/gm, '');
    // html decode
    html = html.replace(/&nbsp;/g, '');

    return html;
}