var BASE_URL = 'http://23.224.242.59';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}