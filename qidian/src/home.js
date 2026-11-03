// Tab theo thể loại của STV; sắp xếp/số chương/loại/trạng thái lấy từ cấu hình.
function execute() {
    return Response.success([
        { title: "Tất cả", input: "cat:", script: "tag.js" },
        { title: "Đồng nhân", input: "cat:dn", script: "tag.js" },
        {"title":"Chư Thiên Vô Hạn","input":"tag:chuthienvohan","script":"tag.js"},
        {"title":"Vô Hạn Lưu","input":"tag:vohanluu","script":"tag.js"},
        {"title":"Chư Thiên","input":"tag:chuthien","script":"tag.js"},
        {"title":"Chư Thiên Lưu","input":"tag:chuthienluu","script":"tag.js"},
        { title: "Huyền huyễn", input: "cat:hh", script: "tag.js" },
        { title: "Đô thị", input: "cat:dt", script: "tag.js" },
        { title: "Ngôn tình", input: "cat:nt", script: "tag.js" },
        { title: "Võng du", input: "cat:vd", script: "tag.js" },
        { title: "Khoa học viễn tưởng", input: "cat:kh", script: "tag.js" },
        { title: "Lịch sử", input: "cat:ls", script: "tag.js" },
        { title: "Dị năng", input: "cat:dna", script: "tag.js" },
        { title: "Linh dị", input: "cat:ld", script: "tag.js" }
    ]);
}
