load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = getChapSTV(url);
        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getChapQidian(url) {
    var response = fetch(url, {
        headers: {
            'user-agent': UserAgent.android(), // set chế độ điện thoại
        }
    });
    var doc = response.html();
    console.log(doc)
    var htm = doc.select('.content').html();
    // var author_say = doc.select('.author-say p').first().html();
    // if(author_say){
    //     htm = htm +"<br><br>PS:<br><br>"+  author_say;
    // }
    return htm.replace(/<br\s*\/?>|\n/g, "<br><br>");
}

function getChapSTV(url) {
    var baseInfor = getBaseInforFromUrlSTV(url);
    var objData = getCurrentIdAndCookie(url);

    // tryUrl = STVHOST + "/index.php?bookid=" + baseInfor.bookId + "&h=qidian&c=" + objData.currentid + "&ngmar=readc&sajax=readchapter&sty=1&exts="
    // var response = fetch(tryUrl, {
    //     method: 'POST',
    //     headers: {
    //         "accept": "*/*",
    //         "accept-language": "vi,en-US;q=0.9,en;q=0.8,ja;q=0.7",
    //         "content-type": "application/x-www-form-urlencoded",
    //         "origin": STVHOST,
    //         "priority": "u=1, i",
    //         "referer": url,
    //         "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"Windows\"",
    //         "sec-fetch-dest": "empty",
    //         "sec-fetch-mode": "cors",
    //         "sec-fetch-site": "same-origin",
    //         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    //         "cookie": "arouting=e; hideavatar=false; _gid=GA1.2.1777745514.1759737760; PHPSESSID=d85q90lse50pokmlk8q2u1a0jd; _ac=a1230840cf965b6ac7c28d8598faefed; _acx=vJ2tveqqXtcOnEV2TGOFtw==; _ga=GA1.1.495287590.1759737760; _ga_MNX3PR1HR4=GS2.1.s1759812485$o5$g1$t1759813038$j60$l0$h0; _gac=9cb20be706d36a2436242c6f9f837835pJFnwsJH2yRwbsA9LRlUU/xGj88M7aMG7x11VMZmLfz5F9NCejU1HoOIZvh1LoZVJoCBcQuZSpOAhGkKdLNGVr9UgCXPnQewmQk5Tet9mIXm2PnXme4="
    //     }
    // });

    // if (!response.ok) throw new Error("Status: " + response.status);

    // var doc = response.html();

    // return doc.select("#content-container").text();

    return "baseInfor.bookId: " + baseInfor.bookId + "\nbaseInfor.chapterId: " + baseInfor.chapterId + "\nobjData.cookie" + objData.cookie + "\nobjData.currentid" + objData.currentid;
}

function getCurrentIdAndCookie(url) {
    var browser = Engine.newBrowser(); // Khởi tạo browser
    browser.launch(url, 2000); // Mở trang web với timeout

    browser.callJs(
        "var div = document.createElement('div');" +
        "div.id = 'div-current-id';" +
        "div.setAttribute('currentid', currentid);" +
        "document.body.appendChild(div);",
        "var div2 = document.createElement('div');" +
        "div2.id = 'div-cookie';" +
        "div2.setAttribute('cookie', document.cookie);" +
        "document.body.appendChild(div2);",
        100
    );
    var doc = browser.html();
    browser.close();

    return {
        currentid: doc.select("#div-current-id").attr("currentid"),
        cookie: doc.select("#div-cookie").attr("cookie")
    };
}

function getBaseInforFromUrlSTV(url) {
    // loại bỏ dấu “/” cuối nếu có
    if (url.charAt(url.length - 1) === '/') {
        url = url.slice(0, url.length - 1);
    }
    var parts = url.split('/');
    // parts = ["https:", "", "sangtacviet.app", "truyen", "qidian", "1", "1046194994", "857411089"]
    // ta muốn phần “1046194994” làm bookId, phần “857411089” làm chapterId
    var len = parts.length;
    var chapterId = parts[len - 1];
    var bookId = parts[len - 2];
    return {
        bookId: bookId,
        chapterId: chapterId
    };
}