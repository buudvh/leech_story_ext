var BASE_URL = 'https://www.mibiquge.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}