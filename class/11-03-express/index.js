// const express = require('express')
import express from "express"

const app = express()

app.get('/', function (req, res) {
  console.log("/")
  res.send('Hello World11')
})

// 상품 구매하기 API
app.post("/products/buy", function (req, res) {
  console.log("/products/buy")
  // 1. 가진돈 검증하는 코드 (대략 10줄 정도)
  // ...
  // ...
  // ...

  // 2. 판매여부 검증하는 코드 (대략 10줄 정도)
  // ...
  // ...
  // ...

  // 3. 상품 구매하는 코드
  // if (돈있음 && !판매완료) {
  //   res.send("상품 구매 완료")
  // }

  res.send("buy.")
})

// 상품 환불하기 API
app.post("/products/refund", function(req, res) {
    console.log("/products/refund")
    // 1. 판매여부 검증하는 코드 (대략 10줄 정도)
    // ...
    // ...

    // 2. 상품 환불하는 코드
    // if (판매완료) {
    //   res.send("상품 환불 완료")
    // }
    
    res.send("refund.")
})

app.listen(3000, "0.0.0.0", () => console.log("server running"))s