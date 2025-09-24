load('libs.js');
load('config.js');

function execute(url) {
    try {
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html();

            return Response.success({
                name: doc.select("h1").text(),
                cover: doc.select("img.object-cover").attr("src") || "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg",
                author: '',
                description: '',
                detail: $.QA(doc, 'main > div > div.bg-white.dark\:bg-gray-800.rounded-lg.shadow-md.p-4.md\:p-6.lg\:p-5.mb-8 > div.flex.flex-row.gap-3.md\:gap-3.lg\:gap-5 > div.w-2\/3.md\:w-2\/3.lg\:w-\[82\.5\%\] > div.mt-2.space-y-1.text-gray-700.dark\:text-gray-300 > p', { m: x => x.text(), j: '<br>' }) + '<br>' + doc.select('.booktime').text(),
                host: BASE_URL
            })
        }

        return Response.error("Status: " + response.status + " " + url);
    } catch (error) {
        return Response.error(error.message);
    }

}