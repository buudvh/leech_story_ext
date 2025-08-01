function execute(url, page) {
    if(!page) page = '1';
    if(url.slice(-1) !== "/")
        url = url + "/";
	url = url.replace('m.biquge345.com', 'www.biquge345.com');
    let response = fetch(url+page+".html");
    if (response.ok) {
        let doc = response.html();
        const data = [];
        let next =  doc.select("li[title*=下一页] a").first().attr("href").split(/[/ ]+/).pop().replace(".html","")
		doc.select(".txt-list-row5 li").forEach(e => {
            data.push({
                name: e.select(".s2 a").first().text(),
                link: e.select(".s2 a").first().attr("href"),
                description: e.select(".s3 a").first().text(),
                host: "http://www.biquge345.com"
            })
        });


        
        return Response.success(data,next)
    }
    return null;
}