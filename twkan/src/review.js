load('config.js');
load('libs.js');

function execute(data) {
    try {
        let doc = Html.parse(data);
        // var response = fetch(url);
        // if (!response.ok) throw new Error(`Status ${response.status}`);

        // var doc = response.html();
        let reviews = [];

        let reviewElms = doc.select(".review-item");

        if (!reviewElms.length) throw new Error(`Không có reviews`);

        reviewElms.forEach(function (e) {
            reviews.push({
                name: convertT2S(e.select('.user').text()),
                content: convertT2S(e.select('.review-text').text()),
            });
        });

        return Response.success(reviews);
    } catch (error) {
        // return Response.error(`${error.message}`);
        return Response.success([{
            name: "信息",
            content: error.message,
        }]);
    }
}
