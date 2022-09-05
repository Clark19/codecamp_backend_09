import express from "express"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import { options } from "./swagger/config.js"
import cors from "cors"

import { getMockUsersData, getMockCoffeeData } from "./utils.js"

import "dotenv/config"
import { checkPhone, getToken, sendToToken } from "./auth/phone.js"
import { checkEmailAddress, getWelcomeTemplate, sendTemplateToEmail } from "./auth/email.js"


const HOST = "0.0.0.0"
const PORT = 3000

const app = express()
app.use(cors())
app.use(express.json())

const openapiSpecification = await swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification))


// 회원 목록 조회 API
app.get("/users", (req, res) => {
  const numOfData = req.query.number || 5
  //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
  const users = getMockUsersData(numOfData)

  res.send(users)
})

app.post("/users", (req, res) => {
  const {name, juminNum, tel, likeSite, password, email} = req.body
  console.log(name, juminNum, tel, likeSite, password, email)
  if (!checkEmailAddress(email)) return

  // 2. 가입환영 템플릿 만들기
  const welcomeTemplate = getWelcomeTemplate({name, tel, likeSite})
  
  // 3. 이메일에 가입환영 템플릿 전송하기
  sendTemplateToEmail(email, welcomeTemplate)

  res.send("가입 완료").status(200)
})


// 커피 메뉴 목록 조회 API
app.get("/starbucks", (req, res) => {
  res.send(getMockCoffeeData(req.query.number || 10))
})


// SMS 전송 기능(인증 문자 메시지) : Coolsms 이용
app.post("/tokens/phone", (req, res) => {
  // 1. 휴대폰 번호 자릿수 맞는지 확인하기
  console.log(req.body)
  const phoneNumber = req.body.phoneNumber
  if (!checkPhone(phoneNumber)) return

  // 2. 핸드폰 토큰 6자리 만들기
  const mytoken = getToken()
  if (!mytoken) return

  // 3. 핸드폰 번호에 토큰 전송하기
  sendToToken(phoneNumber, mytoken)

  res.send("인증완료!!!")
})



app.listen(PORT, HOST, () => console.log(`Server Running at ${HOST}:${PORT} ...`))
