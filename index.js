import http from 'node:http';
import url from 'node:url';
import { initDownloadsDirectory, youtubeDownload } from "./download.js";

initDownloadsDirectory();

const port = 3000;

const requestListener = async function (req, res) {
  try {
    const { url: videoUrl, audioonly: isAudioOnly } = url.parse(req.url, true).query;
    await youtubeDownload(videoUrl, isAudioOnly);
    res.writeHead(200);
    res.end('Video downloaded');
  } catch (error) {
    console.error(error);
    res.writeHead(400);
    res.end('Error');
  }
}

const server = http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
