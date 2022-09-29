import { UnprocessableEntityException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService, //
    private readonly usersService: UsersService, //
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne({ email });

    // 2. 일치하는 유저가 없으면 ? 에러 던지기!
    if (!user)
      throw new UnprocessableEntityException(
        '이메일이 일치하는 유저가 없습니다.',
      );

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?
    const isAuth = await bcrypt.compare(password, user.password); //
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 프론트엔드 브라우저 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({ user, res: context.res });

    // 4. 일치하는 유저도 있고, 비밀번호도 맞았다면?
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달
    return this.authService.getAccessToken({ user }); // response body에 accessToken을 넣는 부분임, 직접 response를 리턴 할 필요는 없음
    // 이 인증 토큰을 받아오는 것까지가 인증임.
  }
}
