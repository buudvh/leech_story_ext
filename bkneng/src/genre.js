// Trang không có danh mục theo thể loại; mỗi khối dưới đây là một nhóm truyện chọn ngẫu nhiên, mỗi lần tải một bộ khác.
function execute() {
    return Response.success([
        { title: "幻想(男频)", input: "boy|幻想", script: "gen.js" },
        { title: "现实", input: "boy|现实", script: "gen.js" },
        { title: "言情", input: "girl|言情", script: "gen.js" },
        { title: "幻想(女频)", input: "girl|幻想", script: "gen.js" },
    ]);
}
