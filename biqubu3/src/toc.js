load('libs.js');
load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        var data = [];
        var elems = $.QA(doc, '#list > a');

        elems.forEach(function (e) {
            data.push({
                name: formatName(e.text()),
                url: e.attr('href'),
                host: BASE_URL,
            })
        });

        data = data.reverse();

        return Response.success(data);
    }
    return null;
}

function formatName(name) {
    const re = /^(\d+)\.第(\d+)章\s*/;
    let result = name.replace(re, '第$2章 ');

    const lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));
    if (lastParenIndex !== -1) {
        result = result.slice(0, lastParenIndex);
    }

    const onlyBracket = /^第\d+章\s*【[^】]*】?\s*$/;
    if (onlyBracket.test(result)) {
        return result.trim();
    }

    result = result.replace(/【.*$/, '');

    return result.trim();
}
