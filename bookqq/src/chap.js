function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        doc = doc.select(".chapter-content");
        doc.select("h1").remove();
        doc.select("div").remove();
        doc.select("a").remove();
        let html = doc.html();
        html = cleanHtml(html)
                .replace(/<p>(.*?)<\/p>/g, '$1<br>')
                .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
                .replace('(本章完)', '')
        

        return Response.success(html);
    }
    return null;
}

function cleanHtml(html) {
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