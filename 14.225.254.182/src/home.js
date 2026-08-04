function execute() {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var script = "homecontent.js";

    return Response.success([
        {
            title: "Mới cập nhật",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=&p={0}",
            script: script
        },
        {
            title: "Hot tuần",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=viewweek&tag=&p={0}",
            script: script
        },
        {
            title: "Hot ngày",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=viewday&tag=&p={0}",
            script: script
        },
        {
            title: "Mới nhập kho",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=new&tag=&p={0}",
            script: script
        },
        {
            title: "Nhiều lượt thích",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=like&tag=&p={0}",
            script: script
        }
    ]);
}
