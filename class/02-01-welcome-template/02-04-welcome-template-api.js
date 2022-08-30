function createUser({name, age, school, email}) {
    // 1. 이메일이 정상인지 확인(1-존재여부, 2-"@"포함여부)
    if (!checkEmail(email)) return

    // 2. 가입환영 템플릿 만들기
    const htmlWelcomeTemplate = getWelcomeTemplate()
    // 3. 이메일에 가입환영 템플릿 전송하기
    sendTemplateToEmail(email, htmlWelcomeTemplate)
    
    return htmlWelcomeTemplate
}

function checkEmail(email) {
    if (!email || !email.includes("@")) {
        console.log("이메일이 정상적이지 않음")
        return false
    }
    return true
}

function getWelcomeTemplate() { 
    const htmlWelcomeTemplate = `
    <html>
      <body>
        <h1>${name}님 가입을 환영합니다!!!</h1>
        <hr>
        <div>이름: ${name}</div>
        <div>나이: ${age}</div>
        <div>학교: ${school}</div>
        <div>Email: ${email}</div>
      </body>
    </html>
    `
    return htmlWelcomeTemplate
}

function sendTemplateToEmail(myemail, htmlWelcomeTemplate) {
    console.log(myemail + "이메일로 가입환영 템플릿 " + htmlWelcomeTemplate + "를 전송합니다.")
}

const name = "철수"
const age = 8
const school = "다람쥐초등학교"
const email = "a@a.com"
createUser({name, age, school, email})