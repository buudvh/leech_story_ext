load('config.js')
function execute(url) {
    try {
        let response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        let doc = response.html();
        let genres = [];
        doc.select(".space-x-4.space-y-2 a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        var descriptionElm = doc.select("#synopsis");
        descriptionElm.select('h2').remove();

        return Response.success({
            name: doc.select("h1.mb-2").text().replace(/·/g, ''),
            cover: doc.select("a img.mx-auto").attr("src"),
            author: doc.select("h1.mb-2 + .mb-6").first().text(),
            genres: genres,
            suggests: [
                {
                    title: "Cùng tác giả: ",
                    input: doc.select('div.mb-2 a').first().attr('href'),
                    script: "gen.js"
                },
                // {
                //     title: "Cùng người đăng: " + doc.select('.mt-2 a')[1].attr('href'),
                //     input: doc.select('.mt-2 a')[1].attr('href'),
                //     script: "gen.js"
                // }
            ],
            description: descriptionElm.text().replace(/\n/g, "<br>").replace(/·/g, '')
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
        // return Response.success({
        //     name: error.message,
        //     cover: "",
        //     author: "",
        // });
    }
}
