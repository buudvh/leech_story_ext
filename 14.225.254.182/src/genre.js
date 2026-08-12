load('common.js');

function execute() {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var prefix = baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=&p={0}";
    var script = "homecontent.js";

    function tag(title, host, sort, tag) {
        var input = `${baseUrl}/io/searchtp/searchBooks?find=&host=${host}&minc=0&sort=${sort}&tag=${tag}&p={0}`;
        return { title: title, input: input, script: script };
    }

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
