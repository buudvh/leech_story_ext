function execute() {
    var rows = [
        ["Top video nhạc Việt Nam", "playlist:PL4fGSI1pDJn4FPCRZtojwqQro5GPY6cuV"],
        ["Top bài hát Việt Nam", "playlist:PL4fGSI1pDJn4bRKr6tjRWaGlqRg_zY_is"],
        ["Top video nhạc thế giới", "playlist:PL4fGSI1pDJn5kI81J1fYWK5eZRl1zJ5kM"],
        ["Danh sách phát âm nhạc", "browse:UC-9-kyTW8ZkZNDHQJ6FgpwQ"],
        ["Đang phát trực tiếp", "browse:UC4R8DWoMoI7CAwX8_LjQHig|Đang phát trực tiếp"],
        ["Trò chơi", "browse:UC4R8DWoMoI7CAwX8_LjQHig|Trò chơi"],
        ["Tin tức", "browse:UCYfdidRxbB8Qhf0Nx7ioOYw"],
        ["Thể thao", "browse:UCEgdi0XIXXZ-qJOFPf4JSKw"],
        ["Học tập", "browse:UCtFRv9O2AHqOZjjynzrv-xg"],
        ["Phim hoạt hình", "search:phim hoạt hình"],
        ["Hài hước", "search:hài hước"],
        ["Nấu ăn", "search:nấu ăn"],
        ["Du lịch", "search:du lịch việt nam"],
        ["Công nghệ", "search:công nghệ"]
    ];
    var out = [];
    for (var i = 0; i < rows.length; i++) {
        out.push({ title: rows[i][0], input: rows[i][1], script: "list.js" });
    }
    return Response.success(out);
}
