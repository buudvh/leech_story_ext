var BASE_URL = 'https://www.bkneng.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// Trang danh sách bản máy tính (có 热门 và 最近更新) và bản wap (có tác giả, giới thiệu); hai bên chọn sách khác nhau.
var PC_PAGES = { boy: '/boy', girl: '/girl' };
var WAP_PAGES = { boy: '/wap', girl: '/wap/index/index/girl.html' };
var LOCKED_NOTICE = '本章为付费章节，网页版仅提供试读，需在「不可能的世界」APP内登录订阅后才能阅读。';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function bkBookId(url) {
    var m = String(url).match(/\/book\/(?:info|read)\/(\d+)/);
    return m ? m[1] : null;
}

function bkBookUrl(bookId) {
    return BASE_URL + '/www/book/info/' + bookId + '.html';
}

function bkCover(src) {
    if (!src) return DEFAULT_COVER;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('http')) return src;
    return BASE_URL + src;
}

function bkJoin(parts, sep) {
    return parts.filter(function (x) { return x; }).join(sep);
}

// Một mục sách lấy từ trang danh sách; trùng id thì gộp thông tin còn thiếu.
function bkAddItem(list, seen, item) {
    if (!item.id || !item.name) return;
    var old = seen[item.id];
    if (old) {
        if (!old.author && item.author) old.author = item.author;
        if (!old.category && item.category) old.category = item.category;
        if (!old.intro && item.intro) old.intro = item.intro;
        if (!old.extra && item.extra) old.extra = item.extra;
        if (!old.cover && item.cover) old.cover = item.cover;
        return;
    }
    seen[item.id] = item;
    list.push(item);
}

function bkToResult(item) {
    var head = bkJoin([item.author ? '作者: ' + item.author : '', item.category], ' | ');
    var intro = String(item.intro || '').replace(/\s+/g, ' ').trim();
    if (intro.length > 80) intro = intro.substring(0, 80) + '...';
    return {
        name: item.name,
        link: bkBookUrl(item.id),
        cover: bkCover(item.cover),
        description: bkJoin([head, item.extra, intro], '\n'),
        host: BASE_URL
    };
}

// Trang máy tính: section là 'hot', 'update' hoặc tiêu đề h1 của khối (神作推荐, 编辑推荐, 言情, 现实, 幻想);
// section rỗng = mọi khối có tiêu đề (trừ hot/update).
function bkParsePcSection(doc, section, list, seen) {
    if (section == 'hot') {
        // Mục đầu có bìa + giới thiệu; các mục sau chỉ là "【thể loại】tên".
        doc.select('.hotBooks li').forEach(function (li) {
            var a = li.select('h1 a').first();
            if (!a.attr('href')) a = li.select('a[href*="/book/info/"]').first();
            var text = a.text();
            var cat = text.match(/^【([^】]*)】/);
            bkAddItem(list, seen, {
                id: bkBookId(a.attr('href')),
                name: text.replace(/^【[^】]*】/, '').trim(),
                category: cat ? cat[1] : li.select('span:not(.icon):not(.idx)').first().text(),
                cover: li.select('img').first().attr('src'),
                intro: li.select('p').first().text()
            });
        });
        return;
    }
    if (section == 'update') {
        doc.select('.recommend_update tr').forEach(function (tr) {
            var td = tr.select('td');
            var a = tr.select('a[href*="/book/info/"]').first();
            bkAddItem(list, seen, {
                id: bkBookId(a.attr('href')),
                name: a.text(),
                category: td.get(0).text(),
                author: td.get(3).text(),
                extra: bkJoin(['最新: ' + td.get(2).text(), td.get(4).text()], ' · ')
            });
        });
        return;
    }
    doc.select('.main > div').forEach(function (box) {
        if (section && box.select('.title h1').first().text() != section) return;
        box.select('article').forEach(function (e) {
            var a = e.select('h1 a').first();
            var spans = e.select('main span');
            bkAddItem(list, seen, {
                id: bkBookId(a.attr('href')),
                name: a.text(),
                author: spans.get(0).text(),
                category: spans.get(1).text(),
                cover: e.select('img').first().attr('src'),
                intro: e.select('p').first().text()
            });
        });
        box.select('.row a[href*="/book/info/"]').forEach(function (a) {
            bkAddItem(list, seen, {
                id: bkBookId(a.attr('href')),
                name: a.select('h2').first().text(),
                category: a.select('span').first().text(),
                cover: a.select('img').first().attr('src')
            });
        });
    });
}

// Trang wap: mọi khối cùng một kiểu, nhận theo tiêu đề; section rỗng = lấy tất cả.
function bkParseWapSection(doc, section, list, seen) {
    doc.select('.indexMain').forEach(function (box) {
        if (section && box.select('.indexMain_TitleName').first().text() != section) return;
        box.select('.indexBookList_In').forEach(function (e) {
            var a = e.select('a[href*="/book/info/"]').first();
            var spans = e.select('.indexBookList_Class span');
            bkAddItem(list, seen, {
                id: bkBookId(a.attr('href')),
                name: e.select('.indexBookList_Name').first().text() || e.select('p').first().text(),
                author: spans.get(0).text(),
                category: spans.get(1).text(),
                extra: bkJoin([spans.get(2).text(), spans.get(3).text()], ' · '),
                cover: e.select('img').first().attr('src'),
                intro: e.select('.indexBookList_synopsis').first().text()
            });
        });
    });
}

function bkFetchHtml(path) {
    var response = fetch(BASE_URL + path);
    if (!response.ok) throw new Error(`Status ${response.status} (${path})`);
    return response.html();
}
