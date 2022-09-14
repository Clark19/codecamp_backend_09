import { UserService } from "./services/user.js";
import { Token } from "../models/token.model.js";
// import { User } from "../models/user.model.js";

// import {
//   checkEmail,
//   getWelcomeTemplate,
//   sendTemplateToEmail,
// } from "../utils/email.js";
import { AppError } from "../errors/app-error.js";

export class UserController {
  /** 1. 회원가입 */
  signup = async (req, res, next) => {
    console.log("req.body:", req.body);
    // const { name, email, personal, prefer, pwd, phone } = req.body;

    try {
      const tokenResult = await Token.findOne({ phone: req.body?.phone });
      if (!tokenResult || !tokenResult.isAuth) {
        console.log("토큰이 없거나 인증되지 않았습니다.");
        throw new AppError(
          "핸드폰 번호가 인증되지 않았거나 존재하지 않습니다",
          422
        );
      }

      const userService = new UserService();
      const newUser_id = userService.makeUser(req.body, tokenResult);
      if (!newUser_id) throw new AppError("회원가입에 실패했습니다", 400);

      res.send(newUser_id);
    } catch (err) {
      console.log("catch err:", err);
      next(err);
    }
  };

  // 2. 로그인
  // 3. 로그아웃
  // 4. 회원탈퇴
  // 5. 회원정보 수정
  // 6. 회원정보 조회

  /** 7. 회원목록 조회 */
  getUsers = async (req, res, next) => {
    try {
      console.log(11);
      const userService = new UserService();
      const users = await userService.getUsers();
      console.log(55);

      res.send(users);
    } catch (err) {
      console.log("catch err:", err);

      next(err);
    }
  };

  // 8. 회원검색
  // 9. 회원정보 초기화
  // 10. 회원정보 복구
}
