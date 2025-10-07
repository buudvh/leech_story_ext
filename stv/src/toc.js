load('libs.js');
load('config.js');

function execute(url) {
    try {
        if (!url.includes("sangtac") && !url.includes("14.225.254.182")) {
            url = STVHOST + "/truyen/qidian/1/" + url.match(/\/book\/(\d+)(?:\/|$)/)[1] + "/";
        }

        var data = getTocSTV(url);

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

function getTocSTV(url) {
    try {
        var data = [];
        var book_id = getBookId(url);
        var tryUrl = STVHOST + '/index.php?ngmar=chapterlist&h=qidian&bookid=' + book_id + '&sajax=getchapterlist';

        var response = fetch(tryUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Referer': STVHOST + "/truyen/qidian/1/" + book_id,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) Response.error("Error try STV: status" + response.status);

        var objData = JSON.parse(response.text());

        if (objData.code != '1') Response.error("Error try STV: x.code" + objData.code);

        var chapters = objData.data.split("-//-");

        for (var i = 0; i < chapters.length; i++) {
            var parts = chapters[i].split("-/-");
            var chapterId = parts[1];
            var chapterName = parts[2];

            data.push({
                name: chapterName.trim().replace(/([\t\n]+|<br>| )/g, "").replace(/([\t\n]+|<br>|&nbsp;)/g, "").replace(/Thứ ([\d\,]+) chương/, "Chương $1:"),
                url: STVHOST + "/truyen/qidian/1/" + book_id + '/' + chapterId + '/',
                host: "",
                id: chapterId
            });
        }

        return data;
    } catch (error) {
        //throw new Error("Error try STV: " + error.message);
        return [
            {
                name: error.message,
                url: "https://sangtacviet.app/truyen/qidian/1/1045207104/845975874/",
                host: "",
                id: 1
            }
        ]
    }
}
