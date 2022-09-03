import express from "express"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"
import { options } from "./swagger/config.js"
import cors from "cors"

import { getMockUsersData, getMockCoffeeData } from "./utils.js"

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


// 커피 메뉴 목록 조회 API
app.get("/starbucks", (req, res) => {
  res.send(getMockCoffeeData(req.query.number || 10))
})

app.listen(PORT, HOST, () => console.log("Server Running..."))


