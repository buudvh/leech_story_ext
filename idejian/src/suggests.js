load('config.js');
load('libs.js');

function execute(raw) {
    try {
        var data = JSON.parse(raw);
        var books = []

        if (!data.length) throw new Error("No comment");

        data.forEach(element => {
            books.push({
                name: element.bookName,
                link: `/book/${element.bookId}/`,
                cover: element.picUrl,
                description: element.bookAuthor
                    + "\n" + element.bookDescription,
                host: BASE_URL
            })
        });

        return Response.success(books);
    } catch (ex) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}