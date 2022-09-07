import express from "express";
import { checkPhone, getToken, sendToToken } from "./phone.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger/config.js";
import cors from "cors";

import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "./email.js";

import "dotenv/config";
import mongoose from "mongoose";
import { Board } from "./models/board.model.js";
import { Token } from "./models/token.model.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.get("/", function (req, res) {
  console.log("/ ping");
  res.send("Hello World");
});

app.get("/boards", async function (req, res) {
  //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
  const result = await Board.find();
  // 2. db에서 꺼내온 결과를 브라우저에 응답(response) 주기
  res.send(result);
});

app.post("/boards", async function (req, res) {
  // 1.클라이언트에서 보낸 데이터 확인
  console.log("/boards post...");
  console.log(req.body);

  // 2. 데이터 등록하는 로직 => 디비에 접속해서 데이터 저장하기
  // 2-1. Board Collection 만들기
  const board = new Board({
    writer: req.body.writer,
    title: req.body.title,
    contents: req.body.contents,
  });
  await board.save();

  // 2-2. API 연동

  // 3. 디비에 저장이 잘됐으면 결과를 클라이언트에 응답(response) 추가
  res.send("게시물 등록에 성공했습니다."); // .send(200)
});

app.post("/tokens/phone", async (req, res) => {
  // 1. 휴대폰 번호 자릿수 맞는지 확인하기
  console.log(req.body);
  const phone = req.body.phone;
  if (!checkPhone(phone)) return;

  // 2. 핸드폰 토큰 6자리 만들기
  const token = getToken();
  if (!token) return;

  let isAuth = false;
  const tokenDoc = new Token({
    phone,
    token,
    isAuth,
  });

  let result = await Token.find({ phone: phone })
  let result2;
  console.log(result);
  if (result.length === 0) {
    result2 = await tokenDoc.save();
    console.log("첨 생성 result2:", result2);
  } else {
    result2 = await Token.updateOne({phone: phone}, {$set: {token: token}})
    console.log("업데이트 result2:", result2);

  }
  // 3. 핸드폰 번호에 토큰 전송하기(추후: 그전엔 콘솔에 출력)
  sendToToken(phone, token);

  res.send(`${phone.slice(0,3)}-${phone.slice(3,7)}-${phone.slice(7)}번호로 인증번호 ${"991153"}를 전송합니다!!!`);
});

app.patch("/tokens/phone", async (req, res) => {
  console.log("pathch:", req.body)
  const { phone, token } = req.body
  const result = await Token.find({ phone: phone })
  console.log(result);
  if (result.length === 0) {// 핸드폰 번호가 저장되어 있지 않다면 클라이언트에 false를 응답
    res.send(false)
    return
  } else { // 핸드폰 번호가 저장되어 있을때
    if (result[0].token !== token) { // 토큰이 다를때
      res.send(false)
      return
    }
    let result2 = await Token.updateOne({phone: phone}, {$set: {isAuth: true}})
    console.log("업데이트 result2:", result2);
    if (result2.modifiedCount > 0 || result2.matchedCount > 0) {
      res.send(true)
      return
    } else {
      res.send(false)
      return
    }
  }
})

app.post("/users", (req, res) => {
  const { name, age, school, email } = req.body;

  // 1. 이메일이 정상인지 확인(1-존재여부, 2-"@"포함여부)
  const isValid = checkEmail(email);
  if (isValid === false) return;

  // 2. 가입환영 템플릿 만들기
  const mytemplate = getWelcomeTemplate({ name, age, school });

  // 3. 이메일에 가입환영 템플릿 전송하기
  sendTemplateToEmail(email, mytemplate);

  res.send("가입 완료");
});


// 0. 몽고DB 접속!!
// database(mydocker04) 없으면 만든 후 접속 함.
mongoose.connect("mongodb://my-database:27017/mydocker04");

// Backend API 서버 오픈!!
app.listen(3000, "0.0.0.0", () => console.log(`server running on 3000`));
