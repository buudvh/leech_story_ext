function execute() {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var prefix = baseUrl + "/io/searchtp/searchBooks?find=&minc=0&sort=update&tag=&p={0}";
    var script = "homecontent.js";

    function category(title, code) {
        var input = code
            ? baseUrl + "/io/searchtp/searchBooks?find=&minc=0&category=" + code + "&sort=update&tag=&p={0}"
            : prefix;
        return { title: title, input: input, script: script };
    }

    function tag(title, host, sort, tag) {
        var input = `${baseUrl}/io/searchtp/searchBooks?find=&host=${host}&minc=0&${sort}=following&tag=${tag}&p={0}`;
        return { title: title, input: input, script: script };
    }

    return Response.success([
        tag("Đồng nhân update(qidian)", "qidian", "update", "diensinhcungnguoi,"),
        tag("Chư thiên vô hạn update(qidian)", "qidian", "qidian", "chuthienvohan,"),
        tag("Chư thiên update(qidian)", "qidian", "qidian", "chuthien,"),
        tag("Đồng nhân viewweek(qidian)", "qidian", "viewweek", "diensinhcungnguoi,"),
        tag("Chư thiên vô hạn viewweek(qidian)", "qidian", "viewweek", "chuthienvohan,"),
        tag("Chư thiên viewweek(qidian)", "qidian", "viewweek", "chuthien,"),
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
