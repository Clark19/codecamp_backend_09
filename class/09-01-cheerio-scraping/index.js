import axios from "axios";
import cheerio from "cheerio";

// async function scrap() {
//   // axios.get으로 요청해서 html 코드 받아오기
//   const result = await axios.get("https://www.naver.com");
//   console.log(result.data);
// }
// scrap();

async function createMessage() {
  // 입력된 메시지 : "안녕하세요~ https://www.naver.com 에 방문해 주세요!"

  // 1. 입력된 메시지에서 http로 시작하는 문장이 있는지 먼저 찾기!
  // .find() 등의 알고리즘 사용하기
  const url = "https://www.naver.com";

  // 2. axios.get으로 요청해서 html 코드 받아오기 => 스크래핑
  const result = await axios.get(url);
  // console.log(result.data);

  // 3. 스크래핑 결과에서 OG(오픈그래프) 코드 골라내서 변수에 저장하기
  const $ = cheerio.load(result.data);
  $("meta").each((i, el) => {
    // if (html(el).attr("property") && html(el).attr("property").includes("og:")) {
    if ($(el).attr("property")?.includes("og:")) {
      const key = $(el).attr("property"); // og:title, og: description, ...
      const value = $(el).attr("content");
      console.log(key, value);
    }
  });
}
createMessage();
