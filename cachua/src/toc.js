load("config.js");

function execute(url) {
  try {
    const id = url.match(/\/page\/(\d+)/)[1];
    url = `https://fanqienovel.com/api/reader/directory/detail?bookId=${id}`;
    const response = fetch(url);
		if (!response.ok) throw new Error(`Status = ${response.status}`);
		const data = response.json().data;
    const list = [];

    data.chapterListWithVolume.forEach((volume) => {
      volume.forEach((chapter) => {
        list.push({
          name: chapter.title,
          url: `${API_URL}/content?item_id=${chapter.itemId}`,
          host: BASE_URL,
        });
      });
    });

    return Response.success(list);
  } catch (error) {
    return Response.error(`Url: ${url} \nMessage: ${error.message}`);
  }
}
