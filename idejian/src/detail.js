load('libs.js');
load('config.js');

//https://wechat.idejian.com/api/wechat/book/13363784/
function execute(url) {
    try {
        var bookid = getBookId(url);
        url = `${WECHAT_URL}/book/${bookid}/`
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var data = response.json();

        if (data.code != 0) throw new Error(`Code = ${data.code}`);
        if (!data.body.bookInfo) throw new Error(`No book infor`);

        var genres = [
            {
                title: data.body.bookInfo.category,
                input: `/subcategory?categoryId=${data.body.bookInfo.categoryId}&page={0}`,
                script: "gen.js"
            },
        ];

        data.body.bookInfo.multiCategory.forEach(element => {
            genres.push({
                title: element.name,
                input: `/subcategory?categoryId=${element.id}&page={0}`,
                script: "gen.js"
            })
        });

        data.body.bookInfo.tag.forEach(element => {
            genres.push({
                title: element,
                input: element,
                script: "tag.js"
            })
        });

        return Response.success({
            name: data.body.bookInfo.bookName,
            cover: data.body.bookInfo.picUrl,
            author: data.body.bookInfo.author,
            description: data.body.bookInfo.desc,
            detail: `更新: ${data.body.newestChapter.updateTime}`,
            ongoing: data.body.bookInfo.completeState == '连载',
            host: BASE_URL,
            suggests: [
                {
                    title: "Suggests",
                    input: JSON.stringify(data.body.newBooksRecommend),
                    script: "suggests.js"
                }
            ],
            genres: genres,
            comments: [
                {
                    title: "评论",
                    input: JSON.stringify(data.body.commentList),
                    script: "comment.js"
                },
            ]
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}