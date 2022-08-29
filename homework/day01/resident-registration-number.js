function customRegistrationNumber(juminNum) {
    if (!checkHypen(juminNum)) return
    if (!checkDigitCount(juminNum)) return

    const replacedJuminNum = replaceJuminNum(juminNum)
    console.log(replacedJuminNum)
    return replacedJuminNum
}

function checkHypen(juminNum) {
    const regex = /.{6}-.{7}/
    
    if (!regex.test(juminNum)) {
        console.log("에러 발생!!! 형식이 올바르지 않습니다!!!")
        return false
    }
    return true
}

function checkDigitCount(juminNum) {
    const regex = /^\d{6}-\d{7}$/
    if (!regex.test(juminNum)) {
        console.log("에러 발생!!! 개수를 제대로 입력해 주세요!!!")
        return false
    }    
    return true
}

function replaceJuminNum(juminNum) {
    // juminNum.replace(/(\d{6})(-)(\d{7})/, "$1$2")
    let splittedJumin = juminNum.split("-")
    splittedJumin[1] = splittedJumin[1].replace(/\d{6}$/, "******")

    return splittedJumin.join("-")
}

customRegistrationNumber("210510-1010101")
customRegistrationNumber("210510-1010101010101")
customRegistrationNumber("2105101010101")
