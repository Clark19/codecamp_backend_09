import cheerio from "cheerio";
import axios from "axios";

export const scrapOg = async (url) => {
  // url = "https://www.naver.com";
  const result = await axios.get(url);
  // console.log(result.data);
  const ogData = {};

  const $ = cheerio.load(result.data);
  $("meta").each((i, el) => {
    if ($(el).attr("property")?.includes("og:")) {
      const key = $(el).attr("property").split(":")[1]; // og:title, og: description, ...
      const value = $(el).attr("content");
      ogData[key] = value;
    }
  });

  delete ogData.url;
  return ogData;
};

console.log(await scrapOg("https://www.naver.com"));
