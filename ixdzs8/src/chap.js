load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var currentHtml = response.text();
        var doc = null;
        let maxRetries = 5; // Giới hạn số lần thử lại (ví dụ 5 lần)
        let retryCount = 0;

        // --- Check if we got challenge page ---
        while ((currentHtml.includes('正在進行安全驗證') || currentHtml.includes('challenge')) && retryCount < maxRetries) {
            retryCount++;
            const tokenMatch = currentHtml.match(/let token\s*=\s*"([^"]+)"/);
            if (tokenMatch) {
                const challengeUrl = url + '?challenge=' + encodeURIComponent(tokenMatch[1]);

                var result = crawler.get(challengeUrl);

                if (result.ok) {
                    currentHtml = result.text();
                    doc = result.html();
                    throw new Error(currentHtml);
                } else {
                    throw new Error(`Failed after challenge redirect: ${challengeUrl}`);
                }
            } else {
                throw new Error(currentHtml);
            }
        }

        var htm = doc.select("article section");
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