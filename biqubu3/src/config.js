let BASE_URL = 'https://www.biqubu3.com';
const DEFAULT_COVER = "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}