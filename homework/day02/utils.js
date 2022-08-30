export function displayTodayDate() {
    const now = new Date();

    const today = {
        year: now.getFullYear(),
        month: now.toLocaleString('ko', {month: 'short'}).padStart(3, "0"),
        date: now.getDate(),
        day: now.toLocaleString('ko', {weekday: 'long'}),
        time: now.toLocaleTimeString("en-GB"),
    }
    
    console.log(`오늘은 ${today.year}년 ${today.month} ${today.date}일 ${today.time}입니다.`)
    return today
}



export function checkEmail(myemail){
    if(myemail === undefined || myemail.includes("@") === false){
        console.log("에러 발생!!! 이메일 주소를 제대로 입력해 주세요!!!")
        return false
    } else {
        return true
    }
}


export class JuminNumber {
    #juminNum
    #maskedJuminNum

    constructor(juminNum) {
        this.#juminNum = juminNum
    }

    #checkHypen() {
        const regex = /.{6}-.{7}/
        
        if (!regex.test(this.#juminNum)) {
            console.log("에러 발생!!! 주민번호 (-) 형식이 올바르지 않습니다!!!")
            return false
        }
        return true
    }
    
    #checkDigitCount() {
        const regex = /^\d{6}-\d{7}$/
        if (!regex.test(this.#juminNum)) {
            console.log("에러 발생!!! 주민번호 자릿수를 제대로 입력해 주세요!!!")
            return false
        }    
        return true
    }
    
    #maskJuminEndNumber() {
        let splittedJumin = this.#juminNum.split("-")
        splittedJumin[1] = splittedJumin[1].replace(/\d{6}$/, "******")
    
        return splittedJumin.join("-")
    }

    getMaskedJuminNumber() {
        if (this.#maskedJuminNum) return this.#maskedJuminNum
        if (!this.#checkHypen()) return false
        if (!this.#checkDigitCount()) return false

        this.#maskedJuminNum = this.#maskJuminEndNumber()
        return this.#maskedJuminNum
    }
}



export function getWelcomeTemplate({ name, email, maskedJuminNumber, tel, likeSite }) { // const {age, createdAt} = { name, age, school, createdAt }
    const mytemplate = `
        <html>
            <body>
                <h1>${name}님 가입을 환영합니다.</h1>
                <hr>
                <div>이메일: ${email}</div>
                <div>주민번호: ${maskedJuminNumber}</div>
                <div>휴대폰 번호: ${tel}</div>
                <div>내가 좋아하는 사이트: ${likeSite}</div>
            </body>
        </html>
    `
    return mytemplate
}

export function sendTemplateToEmail(result){
    console.log(result)
}


