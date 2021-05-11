const express = require("express");

const newsRouter = express.Router();

const scrapeNewsFrom = require("../functions/scraper");

newsRouter.get("/", async (req, res) => {
  const sites = {
    en: "https://www.thinkgeoenergy.com/",
    es: "https://www.piensageotermia.com/",
  };

  const { lang } = req.query;

  let promise = undefined;

  switch (lang) {
    case "en":
      promise = await scrapeNewsFrom(sites[lang]);
      if (!promise.error) {
        res.statusCode = 200;
        res.json(promise.news);
      } else {
        res.statusCode = 500;
        res.send(promise.error);
      }
      break;
    case "es":
      promise = await scrapeNewsFrom(sites[lang]);
      if (!promise.error) {
        res.statusCode = 200;
        res.json(promise.news);
      } else {
        res.statusCode = 500;
        res.send(promise.error);
      }
      break;
    case "en-es":
      const promiseEN = await scrapeNewsFrom(
        sites[lang.slice(0, lang.indexOf("-"))]
      );
      const promiseES = await scrapeNewsFrom(
        sites[lang.slice(lang.indexOf("-") + 1, 5)]
      );

      if (!promiseEN.error && !promiseES.error) {
        res.statusCode = 200;
        res.json(promiseEN.news.concat(promiseES.news));
      } else {
        res.statusCode = 500;
        res.send({
          error1: promiseEN.error,
          error2: promiseES.error,
        });
      }
      break;
    default:
      res.statusCode = 400;
      res.send(
        "Should be one of this options 'en', 'es' or 'en-es' without the single quotations marks."
      );
      break;
  }
});

module.exports = newsRouter;
