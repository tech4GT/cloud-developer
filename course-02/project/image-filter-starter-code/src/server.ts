import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/filteredimage", async (req, res) => {
    let url = req.query.url || req.body.url;
    if (!url) res.sendStatus(400);
    let img = await filterImageFromURL(url)
    res.on('finish', () => {
      deleteLocalFiles([img]);
    })
    res.sendFile(img);
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send(`try GET /filteredimage?image_url=""`)
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();