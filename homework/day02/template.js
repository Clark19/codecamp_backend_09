// 2. 가입 환영 템플릿 만들기

import {checkEmail, JuminNumber, getWelcomeTemplate, sendTemplateToEmail} from "./utils.js"

function createUser({ name, email, SocialSecurityNumber, tel, likeSite }){
    // 1. 이메일이 정상인지 확인(1-존재여부, 2-"@"포함여부)
    if(!checkEmail(email)) return
    
    const maskedJuminNumber = new JuminNumber(SocialSecurityNumber).getMaskedJuminNumber()
    if (!maskedJuminNumber) return

    // 2. 가입환영 템플릿 만들기
    const mytemplate = getWelcomeTemplate({ name, email, maskedJuminNumber, tel, likeSite })

    // 3. 이메일에 가입환영 템플릿 전송하기
    sendTemplateToEmail(mytemplate)
}

const customInfo = {
    name : "코드캠프",
    email : "email@gmail.com",
    SocialSecurityNumber : "210510-1010101",
    tel : "010-1111-2222",
    likeSite : "www.google.com"
}
createUser(customInfo)