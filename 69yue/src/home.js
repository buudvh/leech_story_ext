function execute() {
    return Response.success([
        { title: "新书", input: "/api/list/0/0/4/{0}.json", script: "gen2.js" },
        { title: "欢迎", input: "/api/list/0/0/1/{0}.json", script: "gen2.js" },
        { title: "完本", input: "/api/list/0/1/2/{0}.json", script: "gen2.js" },


        { title: "今日上新·值得一试的佳作", input: "https://www.69yue.top/shudan/3.html", script: "gen.js" },
        { title: "只此一人·单女主的心动时刻", input: "https://www.69yue.top/shudan/4.html", script: "gen.js" },
        { title: "清风有信·修仙慢行", input: "https://www.69yue.top/shudan/1.html", script: "gen.js" },
        { title: "跨越大洋的灯火·美利坚群像选读", input: "https://www.69yue.top/shudan/2.html", script: "gen.js" },
    ]);
}