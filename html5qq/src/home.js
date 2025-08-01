function execute() {
    return Response.success([
        {title:"全部分类",input:"https://bookshelf.html5.qq.com/qbread/api/rank/list?ch=001995&groupid=1501&start={{page}}&count=20&sort=0&sub=&tag=&words=&finish=&t=20230302222523", script: "gen.js"},
        {
            title: "男-诸天流",
            input: "groupid=20023&start={{page}}&count=20&sort=0&sub=",
            script: "gen.js"
        },
        {
            title: "男-无限流",
            input: "groupid=20008&start={{page}}&count=20&sort=0&sub=",
            script: "gen.js"
        },
        {
            title: "男-武侠同人",
            input: "groupid=1503&start={{page}}&count=20&sort=0&sub=武侠同人",
            script: "gen.js"
        },
        {
            title: "男-衍生同人",
            input: "groupid=1512&start={{page}}&count=20&sort=0&sub=衍生同人",
            script: "gen.js"
        },

    ]);
}