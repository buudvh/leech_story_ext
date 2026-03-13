function execute() {
    return Response.success([
        {title: "最新", input: "tongren/index.html♥tongren/index_{0}.html", script: "gen.js"},
        {title: "排行", input: "hot♥hot/index_{0}.html", script: "gen.js"},
        {title: "连载", input: "tags-151-0.html♥tags-151-{0}.html♥{0}-1", script: "gen.js"},
        {title: "全本", input: "tags-150-0.html♥tags-150-{0}.html♥{0}-1", script: "gen.js"},
    ]);
}