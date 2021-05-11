const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");

const getImg = (thumbnail) =>
  thumbnail.children().find("figure.img > img").attr("src");

const getArticleMeta = (thumbnail) => thumbnail.find(".article-meta").text();

const getCaption = (thumbnail) => thumbnail.find(".caption").text().trim();

const getUrl = (thumbnail) => thumbnail.attr("href");

const scrapeNewsFrom = async (baseURL) => {
  let news = [];

  try {
    const response = await fetch(baseURL);
    const text = await response.text();

    const $ = cheerio.load(text);

    const scrapedThumbnails = $(".thumbnail");

    const filteredThumbnails = scrapedThumbnails.filter(
      (index, thumbnail) => !$(thumbnail).hasClass("small")
    );

    filteredThumbnails.map((index, thumb) => {
      let thumbnail = {
        img: getImg($(thumb)),
        articleMeta: getArticleMeta($(thumb)),
        caption: getCaption($(thumb)),
        url: getUrl($($(thumb).children()["0"])),
      };

      news.push(thumbnail);
    });

    return {
      news,
      error: null,
    };
  } catch (error) {
    return {
      news: null,
      error,
    };
  }
};

module.exports = scrapeNewsFrom;
