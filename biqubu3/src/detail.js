load('libs.js');
load('config.js');
load('gbk.js');

function execute(url) {
    try {
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html();

            return Response.success({
                name: $.Q(doc, '#info > h1').text(),
                cover: doc.select("#fmimg > img").attr("src") || DEFAULT_COVER,
                author: $.Q(doc, '#info > p:nth-child(1) >').text().trim().replace('作    者：', ''),
                description: $.QA(doc, '#intro p', { m: x => x.text(), j: '<br>' }),
                detail: '',
                host: BASE_URL,
            })

        }
        return Response.success({
                name: 'BUG',
                cover: DEFAULT_COVER,
                author: '',
                description: `failed to fetch: ${response.status}`,
                detail: '',
                host: BASE_URL,
            });
    } catch (error) {
        return Response.success({
                name: 'BUG',
                cover: DEFAULT_COVER,
                author: '',
                description: error.message,
                detail: '',
                host: BASE_URL,
            })
    }

}