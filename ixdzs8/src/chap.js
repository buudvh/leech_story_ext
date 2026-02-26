load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();

        // --- Check if we got challenge page ---
        if (html.includes('正在進行安全驗證') || html.includes('challenge')) {
        const tokenMatch = html.match(/let token\s*=\s*"([^"]+)"/);
        if (tokenMatch) {
            const challengeUrl =
            chapterUrl + '?challenge=' + encodeURIComponent(tokenMatch[1]);

            result = await fetchApi(challengeUrl);
            if (!result.ok)
            throw new Error(`Failed after challenge redirect: ${challengeUrl}`);
            html = await result.text();
        }
        }

        // --- Parse content ---
        const $ = parseHTML(html);
        const $content = $('article section');
        
        var htm = doc.select(".page-content");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h3").remove();

        htm = htm.html();
        htm = htm.cleanHtml();
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}