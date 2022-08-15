import fs from 'node:fs';
import ytdl from 'ytdl-core';

export async function youtubeDownload(url, audioOnly = false) {
  try {
    initDownloadsDirectory();
    const result = await ytdl.getBasicInfo(url);
    const info = await ytdl.getInfo(url);
    const title = result?.player_response?.videoDetails?.title || new Date();

    const { container: format } = ytdl.chooseFormat(info.formats, { quality: audioOnly ? 'highestaudio' : null });
    const filePath = `./downloads/${Date.now()}.${format}`;


    await saveVideo(url, filePath, audioOnly);
      
    return {filePath, fileName: `${title}.${format}`};
  } catch (error) {
    console.error(error);
    console.log(`\nPlease check if the URL is correct: ${url}`);
    throw new Error();
  }
}

export function initDownloadsDirectory() {
  if (!fs.existsSync('./downloads')) {
    fs.mkdirSync('./downloads');
  }
}


function saveVideo(url, filePath, audioOnly) {
  return new Promise(resolve => {
    ytdl(url, {
      filter: audioOnly ? 'audioonly' : null
    })
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        resolve(true);
      });
  });
}