import { UnprocessableEntityException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

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
  ) {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOne(email);

    // 2. 일치하는 유저가 없으면 ? 에러 던지기!
    if (!user)
      throw new UnprocessableEntityException(
        '이메일이 일치하는 유저가 없습니다.',
      );

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?
    const isAuth = await bcrypt.compare(password, user.password); // bcrypt.hash(password, salt) == user.password 하면 안됨. 매번 동일한 암호화된 비번이 생성되지 않음.
    if (!isAuth)
      throw new UnprocessableEntityException('비밀번호가 틀렸습니다.');

    // 4. 일치하는 유저도 있고, 비밀번호도 맞았다면?
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달
    return this.authService.getAccessToken({ user });
    // 이 인증 토큰을 받아오는 것까지가 인증임.
  }
}
