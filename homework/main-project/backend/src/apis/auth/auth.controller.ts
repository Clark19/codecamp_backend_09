import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
// ! 주의
import { Request, Response } from 'express';

interface IOAuthUser {
  user?: {
    email: string;
    password: string;
    name: string;
    // age: number;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  private async socialLogin(
    req: Request & IOAuthUser,
    res: Response,
    redirectUrl: string,
  ) {
    // 1. 회원조회
    let user = await this.usersService.findOne(req.user.email);

    // 2. 회원가입이 안돼있으면 자동회원가입
    if (!user) {
      const { password, name: nickName } = req.user;
      user = await this.usersService.create({
        email: req.user.email,
        password,
        nickName,
        phone: '',
      });
    }

    // 3. 회원가입이 돼있다면? 로그인(accesToken 만들어서 프론트엔드에 추가)
    this.authService.setRefreshToken({ user, res });

    // 주의 반드시 import { Request, Response } from 'express';
    res.redirect(redirectUrl);
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.socialLogin(req, res, process.env.REDIRECT_URL);
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.socialLogin(req, res, process.env.REDIRECT_URL);
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    this.socialLogin(req, res, process.env.REDIRECT_URL);
  }
}
