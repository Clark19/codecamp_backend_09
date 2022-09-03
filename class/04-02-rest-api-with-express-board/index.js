// const express = require('express')
import express from "express"

import { checkPhone, getToken, sendToToken } from "./phone.js"
import ddd from "./phone.js"

ddd()

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
  console.log("////")
  res.send('Hello World11')
})


app.get('/boards', function (req, res) {
  console.log("/boards call")

  //1. 데이터 조회하는 로직 => DB에 접속해서 데이터 꺼내오기
  const result = [
    {number: 1, writer:"name1", title:"title1", contents:"content1"},
    {number: 2, writer:"name2", title:"title2", contents:"content2"},
    {number: 3, writer:"name3", title:"title3", contents:"content3"},
  ]

  console.log("/boards end")
  
  // 2. db에서 꺼내온 결과를 브라우저에 응답(response) 주기
  res.send('boards')
})

app.post("/boards", function(req, res) {
  // 1.클라이언트에서 보낸 데이터 확인  
  console.log("/posts ...")
  console.log(req.body)
    
    // 2. 데이터 등록하는 로직 => 디비에 접속해서 데이터 저장하기
    //

    // 3. 디비에 저장이 잘됐으면 결과를 클라이언트에 응답(response) 추가
    res.send("게시물 등록에 성공했습니다.") // .status(200)
})

app.post("/tokens/phone", (req, res) => {
    // 1. 휴대폰 번호 자릿수 맞는지 확인하기
    console.log(req.body)
    const phoneNumber = req.body.phoneNumber
    if (!checkPhone(phoneNumber)) return
    

    // 2. 핸드폰 토큰 6자리 만들기
    const mytoken = getToken()
    if (!getToken()) return
    
    // 3. 핸드폰 번호에 토큰 전송하기(추후: 그전엔 콘솔에 출력)
    sendToToken(phoneNumber, mytoken)
    
    res.send("인증완료!!!")
})

app.listen(3000, "0.0.0.0", () => console.log("server running"))