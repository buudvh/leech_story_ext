load('common.js');
load('filter_host.js');

// Nhãn lấy từ dữ liệu bộ lọc của STV (searchfaceted.json) theo nguồn đang chọn, xếp theo số truyện.
function execute() {
    var url = stvBase() + "/searchfaceted.json";
    try {
        var response = fetch(url);
        if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);

        var json = response.json() || {};
        var host = filterHost();
        var category = {};
        if (host) {
            // Nguồn không có trong dữ liệu (vd wanbentxt) hoặc chưa có nhãn ⇒ danh sách rỗng.
            category = (json[host] && json[host].category) || {};
        } else {
            // Như aggregateFaceted() của trang STV: cộng nhãn có dấu cách của mọi nguồn, bỏ tổng < 100.
            for (var h in json) {
                if (!Object.prototype.hasOwnProperty.call(json, h)) continue;
                var face = (json[h] && json[h].category) || {};
                for (var c in face) {
                    if (!Object.prototype.hasOwnProperty.call(face, c)) continue;
                    if (c.indexOf(" ") <= 0) continue;
                    category[c] = (category[c] || 0) + (Number(face[c]) || 0);
                }
            }
            for (var k in category) {
                if (category[k] < 100) delete category[k];
            }
        }

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
