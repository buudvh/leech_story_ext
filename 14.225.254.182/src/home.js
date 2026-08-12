function execute() {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var script = "homecontent.js";
    var host = ["69shu", "qidian", "fanqie"];
    var hometag = [];
    host.forEach(e => {
        hometag.push({
            title: `(${e})Update`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=update&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})Viewday`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=viewday&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})ViewWeek`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=viewweek&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})AllView`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=view&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})Like`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=like&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})Following`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=following&tag=&p={0}`,
            script: script
        })
    });

    host.forEach(e => {
        hometag.push({
            title: `(${e})Bookmarked`,
            input: `${baseUrl}/io/searchtp/searchBooks?find=&host=${e}&minc=0&sort=bookmarked&tag=&p={0}`,
            script: script
        })
    });

    return Response.success(hometag);
}
