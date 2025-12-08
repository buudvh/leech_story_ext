load('config.js');
load('libs.js');
function execute(raw) {
    try {
        var data = JSON.parse(raw);
        var comments = []

        if(!data.length) throw new Error("No comment");
        
        
        data.forEach(element => {
            comments.push({
                name: element.nick,
                content: element.content,
            })
        });

        return Response.success(comments);
    } catch (ex) {
        // return Response.error(`Url: ${url} \nMessage: ${error.message}`);
        return Response.success([{
            name: "信息",
            content: ex.message,
        }]);
    }
}