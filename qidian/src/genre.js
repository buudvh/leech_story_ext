load('common.js');

// Nhãn lấy trực tiếp từ dữ liệu bộ lọc của STV (searchfaceted.json), xếp theo số truyện.
function execute() {
    var url = STVHOST + "/searchfaceted.json";
    try {
        var response = fetch(url);
        if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);

        var json = response.json();
        var category = json && json.qidian && json.qidian.category;
        if (!category) return Response.error('fetch ' + url + ' failed: không có nhãn qidian');

        var arr = [];
        for (var name in category) {
            if (!Object.prototype.hasOwnProperty.call(category, name)) continue;
            var cat = String(name).trim();
            // Như trang STV: chỉ lấy tên có dấu cách; bỏ tên lặp kiểu "sử sử".
            if (!cat || cat.indexOf(" ") <= 0) continue;
            if (/^(\S+) \1$/.test(cat)) continue;
            arr.push({ name: cat, value: Number(category[name]) || 0 });
        }
        arr.sort(function (a, b) { return b.value - a.value; });

        var seen = {};
        var data = [];
        arr.forEach(function (item) {
            var slug = slugVietnamese(item.name);
            if (!slug || seen[slug]) return;
            seen[slug] = true;
            data.push({ title: titleCase(item.name), input: "tag:" + slug, script: "tag.js" });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
