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
import { Starbucks } from "./models/starbucks.model.js";
import { User } from "./models/user.model.js";

import { AppError } from "./errors/app-error.js";
import { scrapOg } from "./ogScrapper.js";

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

app.post("/tokens/phone", async (req, res, next) => {
  try {
    // 1. 휴대폰 번호 자릿수 맞는지 확인하기
    console.log(req.body);
    const phone = req.body?.phone;
    if (!checkPhone(phone)) {
      // throw { status: 400, message: "휴대폰 번호를 확인해주세요." };
      throw new AppError("휴대폰 번호를 확인해주세요.", 400);
    }

    // 2. 핸드폰 토큰 6자리 만들기
    const token = getToken();
    if (!token) throw new AppError("토큰 생성에 실패했습니다.", 500);

    let result = await Token.findOneAndUpdate(
      { phone },
      { $set: { token, isAuth: false } },
      { upsert: true } // upsert: true => 없으면 만들고 있으면 업데이트  // upsert: false => 없으면 만들고 있으면 업데이트 안함
    );
    console.log(!result ? "새로운 전화번호&토큰 생성" : "기존 토큰 업데이트");

    // 3. 핸드폰 번호에 토큰 전송하기(추후: 그전엔 콘솔에 출력)
    sendToToken(phone, token);

    // res.send(`${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}번호로 인증번호 ${"991153"} 를 전송합니다!!`);
    res.send("핸드폰으로 인증 문자가 전송되었습니다!");
  } catch (err) {
    next(err);
  }
});

const checkToken = async (phone, token, isInPatch, res) => {
  let result = await Token.findOne({ phone: phone });
  if (!result) {
    // 핸드폰 번호가 디비에 저장 안되어 있을 때
    if (isInPatch) return false;
    else
      throw new AppError(
        "핸드폰 번호가 존재하지 않거나 인증되지 않았습니다",
        422
      );
  }

  if (result.token !== token) {
    if (isInPatch) return false;
    else throw new AppError("에러! 토큰 번호가 일치하지 않습니다.", 422);
  } else if (result.token === token) {
    result = await Token.updateOne(
      { phone: phone },
      { $set: { isAuth: true } }
    );
    console.log("업데이트 result:", result);
    if (result.modifiedCount > 0 || result.matchedCount > 0) return true;
    else throw new AppError("에러! 알수 없는 이유로 토큰 업데이트 실패", 500);
  }
};

app.patch("/tokens/phone", async (req, res, next) => {
  try {
    const { phone, token } = req.body;
    if (await checkToken(phone, token, true, res)) res.send(true);
    else res.status(400).send(false);
  } catch (err) {
    next(err);
  }
});

app.post("/users", async (req, res, next) => {
  const { name, email, personal, prefer, pwd, phone } = req.body;
  console.log(req.body);

  try {
    const tokenResult = await Token.findOne({ phone: phone });
    if (!tokenResult || !tokenResult.isAuth)
      throw new AppError(
        "핸드폰 번호가 인증되지 않았거나 존재하지 않습니다",
        422
      );

    // 1. 이메일이 정상인지 확인(1-존재여부, 2-"@"포함여부)
    const isValid = checkEmail(email);
    if (isValid === false) return;

    const ogData = await scrapOg(prefer);
    // console.log(ogData);
    let personals = personal.split("-");

    const user = new User({
      name,
      email,
      personal: personals[0] + "-" + personals[1].replace(/\d/g, "*"),
      prefer,
      pwd,
      phone,
      token: tokenResult.token,
      og: ogData,
    });
    const newUser = await user.save();
    // console.log("저장완료:", newUser);
    // console.log("user id :", newUser._id);

    // 2. 가입환영 템플릿 만들기
    const mytemplate = getWelcomeTemplate({ name, prefer, email });

    // 3. 이메일에 가입환영 템플릿 전송하기
    sendTemplateToEmail(email, mytemplate);

    res.send(newUser._id);
  } catch (err) {
    next(err);
  }
});

app.get("/users", async (req, res, next) => {
  try {
    let users = await User.find();
    users = users.map((user) => {
      // delete user._doc.pwd;
      // delete user._doc.token;
      // delete user._doc.__v;
      const { pwd, token, __v, ...rest } = user._doc;
      return rest;
    });
    res.send(users);
  } catch (err) {
    next(err);
  }
});

app.get("/starbucks", async (req, res) => {
  let itemsPerPage = req.query.itemsPerPage || 30;
  let page = req.query.page || 1;
  const result = await Starbucks.find({})
    .limit(itemsPerPage)
    .skip(itemsPerPage * (page - 1));
  res.send(result);
});

/** 전역 에러 핸들러 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // .send(err.message || "알 수 없는 에러가 발생했습니다.");
  res.json({ status: err.status, message: err.message });
});

// 0. 몽고DB 접속!!
// database(starbucksmongodb) 없으면 만든 후 접속 함.
// mongoose.connect("mongodb://my-database:27017/starbucksmongodb");
mongoose.connect("mongodb://my-database:27017/starbucksmongodb");

// Backend API 서버 오픈!!
app.listen(3000, "0.0.0.0", () => console.log(`server running on 3000`));
