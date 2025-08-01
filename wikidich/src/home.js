load('config.js');

function execute() {
    let year = new Date().getFullYear().toString();
    return Response.success([
        {
            "title": "Review",
            "script": "review.js",
            "input": "/review?cat=5794f03dd7ced228f4419196"
        },
        {
            "title": "Diễn sinh",
            "script": "gen.js",
            "input": BASE_URL + "/tim-kiem?qs=1&gender=5794f03dd7ced228f4419196&official=5794f03dd7ced228f4419194&m=6&so=4&y=" + year + "&vo=1"
        },
        {
            "title": "Chương mới",
            "script": "gen.js",
            "input": BASE_URL + "/chuong-moi?gender=5794f03dd7ced228f4419196"
        },
        {
            "title": "Mới cập nhật",
            "script": "gen.js",
            "input": BASE_URL + "/tim-kiem?qs=1&gender=5794f03dd7ced228f4419196&m=6&so=4&y=" + year + "&vo=1"
        },
        {
            "title": "Rating",
            "script": "gen.js",
            "input": BASE_URL + "/tim-kiem?qs=1&gender=5794f03dd7ced228f4419196&m=6&so=2&y=" + year + "&vo=1"
        },
        {
            "title": "Đọc nhiều",
            "script": "gen.js",
            "input": BASE_URL + "/tim-kiem?qs=1&gender=5794f03dd7ced228f4419196&m=6&y=" + year + "&vo=1"
        }
    ]);
}