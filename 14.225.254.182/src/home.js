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
            title: "Lượt đọc tuần",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=viewweek&tag=&p={0}",
            script: script
        },
        {
            title: "Lượt đọc ngày",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=viewday&tag=&p={0}",
            script: script
        },
        {
            title: "Diễn Sinh 1",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=diensinh,&p={0}",
            script: script
        },
        {
            title: "Diễn Sinh 2",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=diensinhcungnguoi,&p={0}",
            script: script
        },
        {
            title: "Chư Thiên Vạn Giới",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=chuthienvangioi,&p={0}",
            script: script
        },
        {
            title: "Chư Thiên Vô Hạn",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=chuthienvohan,&p={0}",
            script: script
        },
        {
            title: "Lượt đọc tổng",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=view&tag=&p={0}",
            script: script
        },
        {
            title: "Mới nhập kho",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=new&tag=&p={0}",
            script: script
        },
        {
            title: "Lượt thích",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=like&tag=&p={0}",
            script: script
        },
        {
            title: "Lượt theo dõi",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=following&tag=&p={0}",
            script: script
        },
        {
            title: "Lượt đánh dấu",
            input: baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=bookmarked&tag=&p={0}",
            script: script
        }
    ]);
}
