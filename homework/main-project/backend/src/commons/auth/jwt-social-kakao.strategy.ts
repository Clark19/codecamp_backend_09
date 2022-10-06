import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

/** 'kakao' strategy  (소셜로그인용)
 *    :  src/commons/auth/파일안 AuthController 에서 'kakao' 이 이름으로 연동해서 사용
 */
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    // 검사하는 부분임. 실패시 리턴
    // {} : 검사하는 로직 작성
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      // clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email', 'profile_nickname'], // 구글/네이버 등의 Docs 에 따라 달라짐
    });
  }

  validate(accessToken, refreshToken, profile) {
    // refreshToken을 안넘겨주는 소셜로그인도 있음.
    // 컨스트럭터의 검사 성공시 validate() 실행됨.
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;

    console.log('profileJson: ', profileJson);
    console.log('kakao_account: ', kakao_account);

    return {
      email: kakao_account.email || 'kakao_' + profileJson.id,
      password: '11',
      name: profile.displayName,
    }; // 리턴값이 req.user에 저장됨.
    // ex) req.user = { email: "a@a.com", id: "sakjsd-kjdfjk" }
  }
}
