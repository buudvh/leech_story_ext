var BASE_URL = 'https://www.bqquge.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
try {
    // Ưu tiên localStorage > Biến toàn cục > Giá trị mặc định hiện tại
    BASE_URL = localStorage.getItem("CONFIG_URL") || (typeof CONFIG_URL !== 'undefined' ? CONFIG_URL : BASE_URL);
} catch (e) {
}