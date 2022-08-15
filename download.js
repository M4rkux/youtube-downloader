import fs from 'node:fs';
import ytdl from 'ytdl-core';

export async function youtubeDownload(url, audioOnly = false) {
  try {
    const result = await ytdl.getBasicInfo(url);
    let info = await ytdl.getInfo(url);
    const title = result?.player_response?.videoDetails?.title || new Date();

    let { container: format } = ytdl.chooseFormat(info.formats, { quality: audioOnly ? 'highestaudio' : null });

    ytdl(url, {
      filter: audioOnly ? 'audioonly' : null
    })
      .pipe(fs.createWriteStream(`downloads/${title}.${format}`));

    return {filePath: `downloads/${title}.${format}`, fileName: `${title}.${format}`};
  } catch (error) {
    console.error(error);
    console.log(`\nPlease check if the URL is correct: ${url}`);
    throw new Error();
  }
}

export function initDownloadsDirectory() {
  if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads');
  }
}