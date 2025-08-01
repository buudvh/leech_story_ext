function execute(url) {
    if(!url.endsWith("/")) url = url + "/";
	url = url.replace('m.biquge345.com', 'www.biquge345.com');
    let response = fetch(url);
    if (response.ok) {
        const data = [];
        let doc = response.html();
        doc = doc.select("div.border");
        doc.select("a").forEach(e => {
            data.push({
                name: e.text(),
                url: "https://www.biquge345.com" + e.attr("href").trim(),
                host: ""
            })
        });

        return Response.success(data);
    }
    return null;
}