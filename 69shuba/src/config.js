var BASE_URL = 'https://www.69shuba.com';
var STVHOST = 'http://14.225.254.182';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/damvanhoangbuu1/hajljnopera-vbook-ext/main/asset/cover.jpg';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}