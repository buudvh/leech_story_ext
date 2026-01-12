function execute() {
    return Response.success([
        {"title": "Update", "input": "/api/nq/amp_last_serial_novel_updates?page={0}&limit=50&language=cn", "script": "gen2.js"},
        {"title": "连载", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=lianzai", "script": "gen.js"},
        {"title": "随选", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=suixuan", "script": "gen.js"},
        {"title": "玄幻", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=xuanhuan", "script": "gen.js"},
        {"title": "都市", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=dushi", "script": "gen.js"},
        {"title": "仙侠", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=xianxia", "script": "gen.js"},
        {"title": "言情", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=gudaiyanqing", "script": "gen.js"},
        {"title": "穿越", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=chuanyuechongsheng", "script": "gen.js"},
        {"title": "游戏", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=youxi", "script": "gen.js"},
        {"title": "科幻", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=kehuan", "script": "gen.js"},
        {"title": "悬疑", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=xuanyi", "script": "gen.js"},
        {"title": "灵异", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=lingyi", "script": "gen.js"},
        {"title": "历史", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=lishi", "script": "gen.js"},
        {"title": "青春", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=qingchun", "script": "gen.js"},
        {"title": "军事", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=junshi", "script": "gen.js"},
        {"title": "竞技", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=jingji", "script": "gen.js"},
        {"title": "现言", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=yanqing", "script": "gen.js"},
        {"title": "其它", "input": "/api/nq/amp_novel_list?language=cn&limit=18&filter=*&page={0}&type=qita", "script": "gen.js"},
    ]);
}