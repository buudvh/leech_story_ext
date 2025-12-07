load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = [];

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var chapternums = doc.select("#catelog").attr('data-size');

        if (!chapternums) throw new Error("Length = 0");

        var bookid = getBookId(url);
        for (let index = 0; index < chapternums; index++) {
            //https://www.idejian.com/catelog/13438991/1?page=1
            data.push(`${BASE_URL}/catelog/${bookid}/1?page=${index + 1}`);
        }

        return Response.success(data);
    } catch (error) {
        return Response.error(error.message);
        // return Response.success([
        //     error.message,
        // ]);
    }
}