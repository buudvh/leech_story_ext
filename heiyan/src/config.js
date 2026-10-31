var BASE_URL = 'https://www.heiyan.com';
var MOBILE_URL = 'https://w.heiyan.com';
var SEARCH_API = 'https://search.heiyan.com/m/search';
var IMG_HOST = 'https://b-new.heiyanimg.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
// Bản máy tính mới có đủ mục lục và danh sách; bản mobile thì dựng bằng JS.
var PC_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
};

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}

function heiyanBookId(url) {
    var m = String(url).match(/\/book\/(\d+)/) || String(url).match(/\/chapter\/(\d+)/);
    return m ? m[1] : null;
}

function heiyanCover(path) {
    if (!path) return DEFAULT_COVER;
    if (path.startsWith('//')) return 'https:' + path;
    if (path.startsWith('http')) return path;
    return IMG_HOST + path;
}
