load('libs.js');

function execute(url) {
    try {
        const [resourceId, serialId] = url.match(/resourceid=(\d+).*serialid=(\d+)/).slice(1);
        let response = fetch('https://novel.html5.qq.com/be-api/content/ads-read', {
            method: 'POST',
            headers: {
                'Referer': 'https://novel.html5.qq.com/',
                'Q-GUID': '0ee63838b72eb075f63e93ae0bc288cb',
                'QIMEI36': '8ff310843a87a71101958f5610001e316a11',
            },
            body: JSON.stringify({
                'ContentAnchorBatch': [
                    {
                        'BookID': resourceId,
                        'ChapterSeqNo': [serialId]
                    }
                ],
                'Scene': 'chapter'
            })
        });

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.json();
        let content = doc.data.Content[0].Content[0];
        content = cleanHtml(content);

        return Response.success(content);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}