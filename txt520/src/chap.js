function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST, REPLACE_HOST);
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html();
        let htm = doc.select(".content").html();
        htm = htm.replace(/\&nbsp;/g, "");
        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}