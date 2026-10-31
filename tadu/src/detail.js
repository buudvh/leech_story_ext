load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookId = taduBookId(url);
        if (!bookId) throw new Error('Không đọc được id truyện');

        url = taduBookUrl(bookId);
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var text = response.text();
        var doc = Html.parse(text);
        var name = cleanText(doc.select('.bookcontent .bookname').first().text()) || meta(doc, 'og:novel:book_name');
        if (!name) throw new Error('Không thấy thông tin truyện');
        var author = cleanText(doc.select('.bookcontent .bookauthor').first().text()) || meta(doc, 'og:novel:author');

        // .bookstate: "完结 · 历史架空 · 261.6万字"
        var state = cleanText(doc.select('.bookcontent .bookstate').first().text()).split('·').map(function (x) {
            return x.trim();
        });
        var status = state[0] || '';
        var category = meta(doc, 'og:novel:category') || state[1] || '';

        var genres = [];
        if (category && CATEGORY_IDS[category]) {
            genres.push({ title: category, input: 'category/listContinue?categoryId=' + CATEGORY_IDS[category] + '&sortType=15', script: 'gen.js' });
        }

        var updateTime = cleanText(doc.select('.catalogue .title').first().text()).replace(/^目录\s*/, '');
        var latest = cleanText(doc.select('.catalogue_list a').first().text());
        var popularity = cleanText(doc.select('.popularity span').first().text());

        var result = {
            name: name,
            cover: taduCover(doc.select('.bookcover img').first().attr('data-src')),
            author: author,
            description: introduce(text) || meta(doc, 'og:description').replace(/^简介：/, ''),
            detail: [
                state.slice(1).join(' · '),
                popularity,
                updateTime,
                latest ? '最新: ' + latest : ''
            ].filter(function (x) { return x; }).join('<br>'),
            ongoing: status.indexOf('完结') == -1,
            url: url,
            host: BASE_URL,
            genres: genres
        };

        var reviewCount = cleanText(doc.select('.bookreview_left').first().text()).replace(/[^\d]/g, '');
        if (reviewCount && reviewCount != '0') {
            result.comment = { title: '书评 (' + reviewCount + ')', input: bookId, script: 'comment.js' };
        }

        return Response.success(result);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function meta(doc, property) {
    return cleanText(doc.select('meta[property="' + property + '"]').first().attr('content'));
}

// Đọc giới thiệu từ HTML gốc để giữ xuống dòng (text()/html() của trình phân tích gộp mất \n).
function introduce(text) {
    var m = String(text).match(/<div class="bookbrief">([\s\S]*?)<\/div>/);
    if (!m) return '';
    return m[1].replace(/<[^>]+>/g, '').trim().split(/\r?\n/).map(function (x) {
        return x.trim();
    }).filter(function (x) { return x; }).join('<br>');
}
