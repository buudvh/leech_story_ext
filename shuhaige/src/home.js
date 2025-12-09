function execute() {
    return Response.success([
        { title: "诸天", input: "诸天", script: "search.js" },
        {"title":"最近更新","input":"/lastupdate/{0}.html","script":"gen.js"},
        {"title":"新书入库","input":"/postdate/{0}.html","script":"gen.js"},
        // {"title":"全部小说","input":"/all/{0}.html","script":"gen.js"},
        // {"title":"玄幻","input":"/XuanHuan/{0}.html","script":"gen.js"},
        // {"title":"奇幻","input":"/QiHuan/{0}.html","script":"gen.js"},
        // {"title":"武侠","input":"/WuXia/{0}.html","script":"gen.js"},
        // {"title":"都市","input":"/DuShi/{0}.html","script":"gen.js"},
        // {"title":"历史","input":"/LiShi/{0}.html","script":"gen.js"},
        // {"title":"军事","input":"/JunShi/{0}.html","script":"gen.js"},
        // {"title":"悬疑","input":"/XuanYi/{0}.html","script":"gen.js"},
        // {"title":"游戏","input":"/YouXi/{0}.html","script":"gen.js"},
        // {"title":"科幻","input":"/KeHuan/{0}.html","script":"gen.js"},
        // {"title":"体育","input":"/TiYu/{0}.html","script":"gen.js"},
        // {"title":"古言","input":"/GuYan/{0}.html","script":"gen.js"},
        // {"title":"现言","input":"/XianYan/{0}.html","script":"gen.js"},
        // {"title":"幻言","input":"/HuanYan/{0}.html","script":"gen.js"},
        // {"title":"仙侠","input":"/XianXia/{0}.html","script":"gen.js"},
        // {"title":"青春","input":"/QinɡChun/{0}.html","script":"gen.js"},
        // {"title":"穿越","input":"/ChuanYue/{0}.html","script":"gen.js"},
        // {"title":"其他","input":"/QiTa/{0}.html","script":"gen.js"}
    ]);
}