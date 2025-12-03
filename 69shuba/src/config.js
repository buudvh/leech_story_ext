var BASE_URL = 'https://www.69shuba.com';
var STVHOST = 'http://14.225.254.182';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';
var COVER_BASE = 'https://static.69shuba.com/files/article/image';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}