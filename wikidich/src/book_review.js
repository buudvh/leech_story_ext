load('config.js');

// Đánh giá của một truyện (/review/truyen/...). Mỗi `.review-group` là một bài review: phần tử `.comment-element` đầu
// là bài, các phần tử `comment-level-1/2` theo sau là trả lời ⇒ `replies` của bài.
function execute(input, next) {
    var options = next ? { queries: { start: next } } : {};
    var response = fetch(input, options);
    if (!response.ok) return Response.error('HTTP ' + response.status + ' ' + input);
    var doc = response.html();

    var reviews = [];
    doc.select('#commentList > .review-group').forEach(function (group) {
        var review = null;
        var lastNameByLevel = {};
        group.select('.comment-element').forEach(function (el) {
            var level = commentLevel(el);
            var name = el.select('.comment-username').text();
            var item = {
                name: name,
                avatar: avatarOf(el),
                content: el.select('.comment-content-msg').html(),
                description: joinParts([
                    level >= 2 && lastNameByLevel[level - 1] ? 'Trả lời ' + lastNameByLevel[level - 1] : '',
                    thanksOf(el),
                    timeAgo(el.select('.comment-interval').attr('data-interval'))
                ])
            };
            lastNameByLevel[level] = name;
            if (!review || level === 0) {
                item.replies = [];
                review = item;
                reviews.push(review);
            } else {
                review.replies.push(item);
            }
        });
    });

    return Response.success(reviews, nextStart(doc));
}

function commentLevel(el) {
    var match = /comment-level-(\d+)/.exec(el.attr('class') || '');
    return match ? parseInt(match[1], 10) : 0;
}

// Ảnh mặc định của trang ⇒ để trống (app hiện hình người).
function avatarOf(el) {
    var src = el.select('.comment-avatar img').attr('src') || '';
    return src.indexOf('default-avatar') >= 0 ? '' : src;
}

function thanksOf(el) {
    var count = parseInt(el.select('.thank-num').text(), 10);
    return count > 0 ? '👍 ' + count : '';
}
