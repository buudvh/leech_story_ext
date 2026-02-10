let BASE_URL = 'https://www.piaotia.com';
var STVHOST = 'https://sangtacviet.app';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var COVER_BASE = 'https://www.piaotia.com/files/article/image';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}