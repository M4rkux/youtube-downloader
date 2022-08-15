import fs from 'node:fs';
import http from 'node:http';
import url from 'node:url';
import { initDownloadsDirectory, youtubeDownload } from "./download.js";

initDownloadsDirectory();

const port = 3000;

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

    fs.exists(filePath, function (exists) {
      if (exists) {
          // Content-type is very interesting part that guarantee that
          // Web browser will handle response in an appropriate manner.
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
server.listen(port, () => {
  console.log(`Server is running on PORT :${port}`);
});
