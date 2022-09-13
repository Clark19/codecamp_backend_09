// 휴대폰 인증 토큰 전송하기
const getValidationNumber = async () => {
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");

  const phone = getPhoneNumber();
  const response = await axios
    .post(RequestUrl.TOKENS_PHONE, {
      phone,
    })
    .catch((e) => console.error(e));
  console.log("res:", response);
};

// 핸드폰 인증 완료 API 요청
const submitToken = async () => {
  const response = await axios
    .patch(RequestUrl.TOKENS_PHONE, {
      phone: getPhoneNumber(),
      token: document.querySelector("#TokenInput").value,
    })
    .catch((e) => console.error(e));

  console.log("핸드폰 인증 결과", response);
};

// 회원 가입 API 요청
const submitSignup = async () => {
  console.log("회원 가입 완료");

  const name = document.querySelector("#SignupName").value;
  const personal =
    document.querySelector("#SignupPersonal1").value +
    "-" +
    document.querySelector("#SignupPersonal2").value;
  const phone = getPhoneNumber();
  const prefer = document.querySelector("#SignupPrefer").value;
  const email = document.querySelector("#SignupEmail").value;
  const pwd = document.querySelector("#SignupPwd").value;

  // const { name, email, personal, prefer, pwd, phone } = document.querySelector("#SignupForm").elements;
  const response = await axios
    .post(RequestUrl.USERS, {
      name,
      email,
      personal,
      prefer,
      pwd,
      phone,
    })
    .catch((e) => console.error(e));
  console.log("res:", response);
};

function getPhoneNumber() {
  const tel1 = document.querySelector("#PhoneNumber01");
  const tel2 = document.querySelector("#PhoneNumber02");
  const tel3 = document.querySelector("#PhoneNumber03");
  const phone = tel1.value + tel2.value + tel3.value;
  return phone;
}
