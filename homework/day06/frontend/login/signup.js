// 휴대폰 인증 토큰 전송하기
const getValidationNumber = async () => {
  document.querySelector('#ValidationInputWrapper').style.display = 'flex'
  console.log('인증 번호 전송')
  
  const tel1 = document.querySelector("#PhoneNumber01")
  const tel2 = document.querySelector("#PhoneNumber02")
  const tel3 = document.querySelector("#PhoneNumber03")
  const tel = tel1.value + tel2.value + tel3.value

  const response = await axios.post(RequestUrl.TOKENS_PHONE, {
    phoneNumber : tel
  }).catch(e => console.error(e))
  console.log("res:", response)
}

// 회원 가입 API 요청
const submitSignup = async () => {
  console.log('회원 가입 이메일 전송')

  const name = document.querySelector("#SignupName").value

  const tel1 = document.querySelector("#PhoneNumber01")
  const tel2 = document.querySelector("#PhoneNumber02")
  const tel3 = document.querySelector("#PhoneNumber03")
  const tel = tel1.value + tel2.value + tel3.value

  const likeSite = document.querySelector("#SignupPrefer").value
  const email = document.querySelector("#SignupEmail").value
  const password = document.querySelector("#SignupPwd").value
  const juminNum = document.querySelector("#SignupPersonal").value + document.querySelector("#SignupPersonal2").valu
  

  const response = await axios.post(RequestUrl.USERS, {
    name, juminNum, tel, likeSite, email, password,
  }).catch(e => console.error(e))
  console.log("res:", response)
}
