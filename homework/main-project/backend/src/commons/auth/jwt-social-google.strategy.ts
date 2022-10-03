import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

/** 'google' strategy  (소셜로그인용)
 *    :  src/commons/auth/파일안 AuthController 에서 'google' 이 이름으로 연동해서 사용
 */
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    // 검사하는 부분임. 실패시 리턴
    // {} : 검사하는 로직 작성
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'], // 구글/네이버 등의 Docs 에 따라 달라짐
    });
  }

  // overriding
  validate(accessToken, refreshToken, profile) {
    // refreshToken은 안들어는 소셜로그인도 있음.
    // 컨스트럭터의 검사 성공시 validate() 실행됨.
    // console.log('구글로그인: ', accessToken); // { email: a@a.com, sub: sakjsd-kjdfjk }
    // console.log(refreshToken);
    // console.log(profile);
    return {
      email: profile.emails[0].value, // 이런것들은 문서나 콘솔로그 짂어서 확인해야 함.
      hashedPassword: '1234',
      name: profile.displayName,
      // age: 0, // 필요하다면 나중에 알림으로 추가하게 유도 방법으로 추가
    }; // 리턴값이 req.user에 저장됨.
    // ex) req.user = { email: "a@a.com", id: "sakjsd-kjdfjk" }
  }
}
