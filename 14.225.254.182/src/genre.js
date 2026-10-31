load('common.js');

function execute() {
    return Response.success([
        category("Tất cả", ""),
        category("Huyền huyễn", "hh"),
        category("Đô thị", "dt"),
        category("Ngôn tình", "nt"),
        category("Võng du", "vd"),
        category("Khoa học viễn tưởng", "kh"),
        category("Lịch sử", "ls"),
        category("Đồng nhân", "dn"),
        category("Dị năng", "dna"),
        category("Linh dị", "ld"),
        category("Light Novel", "ln")
    ]);
}

function category(title, code) {
    var input = stvBase() + "/io/searchtp/searchBooks?find=&minc=0" + (code ? "&category=" + code : "") + "&sort=update&tag=&p={0}";
    return { title: title, input: input, script: "homecontent.js" };
}
