function getToken(digit) {
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
    return result
}

getToken(4)
getToken(-2)
getToken(13)
getToken("kk")
