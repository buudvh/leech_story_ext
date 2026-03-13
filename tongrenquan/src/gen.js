load('libs.js');

function execute(url, page) {
  var newUrl = '';
  try {
    page = page || '1';
    var params = url.split('♥');

    var fm = BASE_URL + '/' + (page.toString() == '1' ? params[0] : params[1]);
    if (params.length == 3) {
      var _eval = String.format(params[2], page);
      newUrl = String.format(fm, eval(_eval));
    }
    else {
      newUrl = String.format(fm, page);
    }

    var response = fetch(newUrl);

    if (!response.ok) throw new Error(`Status = ${response.status}`);

    var doc = response.html('gb2312');

    var data = [];

    var elems = $.QA(doc, 'div.bk > a');
    if (!elems.length) throw new Error("Length = 0");

    elems.forEach(function (e) {
      var updateDate = `更新：${$.Q(e, 'div.booknews label.date').text()}`
      data.push({
        name: $.Q(e, 'div.infos > h3').text().formatTocName(),
        link: e.attr('href'),
        cover: BASE_URL + e.select('div.pic > img').attr('src'),
        description: $.Q(e, 'div.infos > div', { remove: 'label' }).text() + "\n" + updateDate,
        host: BASE_URL
      })
    })

    var next = $.Q(doc, 'div.page > b').text();
    if (next) next = parseInt(next) + 1;

    return Response.success(data, next.toString());
  } catch (error) {
    return Response.error(`Url: ${newUrl}\nMessage: ${error.message}`);
  }
}