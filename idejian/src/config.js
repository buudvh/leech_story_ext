var BASE_URL = 'https://www.idejian.com';
var WECHAT_URL = 'https://wechat.idejian.com/api/wechat'
var STVHOST = 'https://sangtacviet.app';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var COVER_BASE = 'https://bookbk.img.zhangyue01.com/idc_1/m_1,w_300,h_400/e71accfb/group62/Qw/na/bde97aaa600f2e411f8fa66b0c29e883.jpg?v=OzO47aOf&t=fwAAAWikcFw.';

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}