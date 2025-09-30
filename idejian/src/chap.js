function execute(chapterUrl) {
    // https://wechat.idejian.com/api/wechat/book/13178363/1

    const apiUrl = chapterUrl
        .replace("https://www.idejian.com", "https://wechat.idejian.com/api/wechat")
        .replace(".html", "");

    const response = fetch(apiUrl);

    if (response.ok) {
        const result = response.json();
        console.log(result.body.content);
        return Response.success(result.body.content);
    }

    return Response.success(apiUrl + "\n" + response.status);
}
