import { getToday } from "../utils.js"
import nodemailer from "nodemailer"

export function checkEmailAddress(email) {
    if(!email || !email.includes("@")) {
        console.log("에러 발생!!! 이메일 주소를 제대로 입력해 주세요!!!")
        return false
    }
    return true
}

export function getWelcomeTemplate({name, tel, likeSite}) {

    const mytemplate = `
        <html>
            <body>
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div>
                        <h1 style="color: blue;">${name}님 가입을 환영합니다!!!</h1>
                        <hr />
                        <div>이름: ${name}</div>
                        <div>전화번호: ${tel}</div>
                        <div>좋아하는 사이트: ${likeSite}</div>
                        <div>가입일: ${getToday()}</div>
                    </div>
                </div>
            </body>
        </html>
    `
    return mytemplate
}

export async function sendTemplateToEmail(userEmail, result){
    // console.log(myemail + "이메일로 가입환영템플릿 " + result + "를 전송합니다!!!")
    const EMAIL_API_USER = process.env.EMAIL_API_USER
    const EMAIL_API_PASS = process.env.EMAIL_API_PASS
    const EMAIL_SENDER = process.env.EMAIL_SENDER

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_API_USER,
            pass: EMAIL_API_PASS
        }
    })

    const response = await transporter.sendMail({
        from: EMAIL_SENDER,
        to: userEmail,
        subject: "[진화캠프] 가입을 축하합니다.",
        html: result
    })
    
    console.log(response)
}