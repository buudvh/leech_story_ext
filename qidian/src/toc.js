load('libs.js');
load('config.js');

function execute(url) {
    try {
        if (!url.includes("sangtac") && !url.includes("14.225.254.182")) {
            url = STVHOST + "/truyen/qidian/1/" + url.match(/\/book\/(\d+)(?:\/|$)/)[1] + "/";
        }

        var data = getTocQidian(url);

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getTocQidian(url) {
    var idBook = getBookId(url);
    var response = fetch("https://m.qidian.com/book/" + idBook + "/catalog/", {
        headers: {
            'user-agent': UserAgent.android(),
        }
    });
    var doc = response.html()
    var text = doc.select("#vite-plugin-ssr_pageContext").html().replace(/\<\/?script(.*?)\"?\>/g, "");
    var json = JSON.parse(text);
    const data = [];
    var q_list = json.pageContext.pageProps.pageData.vs
    q_list.forEach((q) => {
        q.cs.forEach((e) => {
            data.push({
                name: e.cN,
                url: "https://m.qidian.com/chapter/" + idBook + "/" + e.id + "/", //
                pay: e.sS == 1 ? false : true,
            })
        });
    })
    return data
}
