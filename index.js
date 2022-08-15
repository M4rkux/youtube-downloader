import fs from 'node:fs';
import http from 'node:http';
import url from 'node:url';
import { initDownloadsDirectory, youtubeDownload } from "./download.js";

initDownloadsDirectory();

const PORT = process.env.PORT || 3000;

const requestListener = async function (req, res) {
  try {
    const { url: videoUrl, audioonly: isAudioOnly } = url.parse(req.url, true).query;

    if (!videoUrl) {
      res.writeHead(200);
      res.end(`Please send the URL like this: ${JSON.stringify({
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        audioonly: 1
      })}`);
      return;
    }

    const { filePath, fileName } = await youtubeDownload(videoUrl, isAudioOnly);

    fs.stat(filePath, function (fileStats) {

      if (!fileStats) {
          res.writeHead(200, {
              "Content-Type": "application/octet-stream",
              "Content-Disposition": "attachment; filename=" + fileName
          });
          fs.createReadStream(filePath).pipe(res);
          return;
      }
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("ERROR File does not exist");
  });
  } catch (error) {
    console.error(error);
    res.writeHead(400);
    res.end('Error');
  }
}

const server = http.createServer(requestListener);
server.listen(PORT, () => {
  console.log(`Server is running on PORT :${PORT}`);
});
