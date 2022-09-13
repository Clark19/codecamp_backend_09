import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { Starbucks } from "./models/starbucks.model.js";

// 0. 몽고DB 접속!!
// database(mydocker04) 없으면 만든 후 접속 함.
mongoose.connect("mongodb://localhost:27017/starbucksmongodb");

async function startCrawling() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://www.starbucks.co.kr/menu/drink_list.do");
  // await page.waitForNavigation(1000);
  await page.waitForTimeout(1000);

  /*
콜드 브루커피 (카테고리)

나이트로 바닐라 크림
#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2) > ul > li:nth-child(1) > dl > dd
li:nth-child(1 ~ length) > dl > dd (음료 분류 - 카테고리내)
카테고리 분류 : 
div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2, 4,짝수) > ul >

이미지 url
#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2) > ul > li:nth-child(1) > dl > dt > a > img



  아이스커피 명
  #container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(4) > ul > li:nth-child(1) > dl > dd


  아이스커피 image url
  #container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(4) > ul > li:nth-child(1) > dl > dt > a > img




  오늘의 커피 명
  #container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(4) > ul > li:nth-child(2) > dl > dd
이미지
  #container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(4) > ul > li:nth-child(2) > dl > dt > a > img


  에스프레소(카테고리)
  블랙 글레이즈드 라떼
  #container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(6) > ul > li:nth-child(1) > dl > dd

카테고리 분류 : 
div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(2, 4,짝수) > ul >
음료 분류 - 카테고리내 :  li:nth-child(1 ~ length) > dl > dd

*/
  const categoryLength = await page.$$eval(
    `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd`,
    (list) => list.length
  );
  console.log(categoryLength);

  const beverages = [];
  for (let i = 1; i <= categoryLength; i++) {
    const beverageLength = await page.$$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${
        2 * i
      }) > ul > li`,
      (list) => list.length
    );
    console.log(beverageLength);

    for (let j = 1; j <= beverageLength; j++) {
      const beverageName = await page.$eval(
        `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${
          2 * i
        }) > ul > li:nth-child(${j}) > dl > dd`,
        (bev) => bev.innerText
      );

      const beverageImgUrl = await page.$eval(
        `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(${
          2 * i
        }) > ul > li:nth-child(${j}) > dl > dt > a > img`,
        (bev) => bev.src
      );
      // beverage.img = beverageImgUrl;
      beverages.push({ name: beverageName, img: beverageImgUrl });

      console.log(
        `음료: ${beverages[beverages.length - 1].name}, 이미지: ${
          beverages[beverages.length - 1].img
        }`
      );
    }
  }

  beverages.forEach(async (beverage) => {
    await new Starbucks({
      name: beverage.name,
      img: beverage.img,
    }).save();
  });

  await browser.close();
}

startCrawling();
