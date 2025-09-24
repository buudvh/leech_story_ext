function execute() {
    return Response.success([
        { title: "新书", input: "/api/list/0/0/4/{0}.json", script: "gen2.js" },
        { title: "欢迎", input: "/api/list/0/0/1/{0}.json", script: "gen2.js" },
        { title: "完本", input: "/api/list/0/1/2/{0}.json", script: "gen2.js" },
    ]);
}
