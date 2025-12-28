var BASE_URL = 'https://www.novels.com.tw';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GENRES = [
  {"title": "成人小說", "input": "/nosort/11/1/", "script": "gen.js"},
  {"title": "肉文小說", "input": "/nosort/12/1/", "script": "gen.js"},
  {"title": "精肉", "input": "/nosort/13/1/", "script": "gen.js"},
  {"title": "玄幻魔法", "input": "/nosort/1/1/", "script": "gen.js"},
  {"title": "武俠修真", "input": "/nosort/2/1/", "script": "gen.js"},
  {"title": "都市言情", "input": "/nosort/3/1/", "script": "gen.js"},
  {"title": "曆史軍事", "input": "/nosort/4/1/", "script": "gen.js"},
  {"title": "科幻靈異", "input": "/nosort/5/1/", "script": "gen.js"},
  {"title": "遊戲競技", "input": "/nosort/6/1/", "script": "gen.js"},
  {"title": "女生耽美", "input": "/nosort/7/1/", "script": "gen.js"},
  {"title": "其他類型", "input": "/nosort/9/1/", "script": "gen.js"},
  {"title": "短篇", "input": "/nosort/10/1/", "script": "gen.js"}
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}