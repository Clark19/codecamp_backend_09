// const express = require('express')
import express from "express"

const app = express()

app.get('/', function (req, res) {
  console.log("/")
  res.send('Hello World11')
})

app.post("/posts", function(req, res) {
    console.log("/posts ...")
    res.send("게시물 등록에 성공했습니다.")
})

app.listen(3000, "0.0.0.0", () => console.log("server running"))