import { scrapOg } from "../../utils/ogScrapper.js";
import { User } from "../../models/user.model.js";

import {
  checkEmail,
  getWelcomeTemplate,
  sendTemplateToEmail,
} from "../../utils/email.js";
import { AppError } from "../../errors/app-error.js";

export class UserService {
  constructor() {}

  makeUser = async (userInfo, tokenResult) => {
    const { name, email, personal, prefer, pwd, phone } = userInfo;

    // 1. 이메일이 정상인지 확인(1-존재여부, 2-"@"포함여부)
    const isValid = checkEmail(email);
    if (isValid === false)
      throw new AppError("이메일 형식이 잘못되었습니다", 400);

    const ogData = await scrapOg(prefer);
    console.log(ogData);
    let personals = personal.split("-");

    const user = new User({
      name,
      email,
      personal: personals[0] + "-" + personals[1].replace(/\d/g, "*"),
      prefer,
      pwd,
      phone,
      token: tokenResult.token,
      og: ogData,
    });
    const newUser = await user.save();
    console.log("저장완료:", newUser);
    console.log("user id :", newUser._id);

    // 2. 가입환영 템플릿 만들기
    const mytemplate = getWelcomeTemplate({ name, prefer, email });

    // 3. 이메일에 가입환영 템플릿 전송하기
    sendTemplateToEmail(email, mytemplate);

    return newUser._id;
  };

  getUsers = async () => {
    console.log(22);

    let users = await User.find();
    console.log("users:", users);

    users = users.map((user) => {
      const { pwd, token, __v, ...rest } = user._doc;
      return rest;
    });
    console.log(33, users);

    return users;
  };
}
