let BASE_URL = 'https://www.piaotia.com';
var STVHOST = 'http://14.225.254.182';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover.jpg';
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}