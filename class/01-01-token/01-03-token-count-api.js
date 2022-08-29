
function createTokenOfPhone(phoneNumber) {
    // 1. 휴대폰 번호 자릿수 맞는지 확인하기
    if (phoneNumber.length !== 10 && phoneNumber !== 11) {
        console.log("에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요")
        return
    }

    // 2. 핸드폰 토큰 6자리 만들기
    const digit = 6
    if (!digit || isNaN(digit)) {
        console.log("자리수를 제대로 입력해 주세요")
        return
    }
    if (digit < 2 || digit >= 10) {
        console.log("에러발생! 범위가 너무 작거나 너무 큽니다")
        return
    }
    

    const result = String(Math.floor(Math.random() * 10**digit)).padStart(digit, "0")
    console.log(result)


    // 3. 핸드폰 번호에 토큰 전송하기(추후: 그전엔 콘솔에 출력)
    console.log(`${phoneNumber}번호' 인증번호 ${result}를 전송합니다!!!`)
}

createTokenOfPhone("01012345678")


createTokenOfPhone(4)
createTokenOfPhone(-2)
createTokenOfPhone(13)
createTokenOfPhone("kk")