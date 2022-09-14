import coolsms from "coolsms-node-sdk";
const mysms = coolsms.default;

export function checkPhone(phoneNumber) {
  if (phoneNumber.length !== 10 && phoneNumber.length !== 11) {
    console.log("에러 발생!!! 핸드폰 번호를 제대로 입력해 주세요");
    return false;
  }
  return true;
}

export function getToken() {
  const digit = 6;
  if (!digit || isNaN(digit)) {
    console.log("자리수를 제대로 입력해 주세요");
    return false;
  }
  if (digit < 2 || digit >= 10) {
    console.log("에러발생! 범위가 너무 작거나 너무 큽니다");
    return false;
  }

  const result = String(Math.floor(Math.random() * 10 ** digit)).padStart(
    digit,
    "0"
  );
  return result;
}

export async function sendToToken(phoneNumber, token) {
  const SMS_KEY = process.env.SMS_KEY;
  const SMS_SECRET = process.env.SMS_SECRET;
  const SMS_SENDER = process.env.SMS_SENDER;

  // const messageService = new mysms(SMS_KEY, SMS_SECRET);
  // const response = await messageService.sendOne({
  //   to: phoneNumber,
  //   from: SMS_SENDER,
  //   text: `[진화캠프] 안녕하세요. 요청하신 인증번호는 [${token}] 입니다.`,
  // });
  // console.log(response);
  console.log(`${phoneNumber}번호로 인증번호 ${token} 를 전송합니다!!!`);
}
