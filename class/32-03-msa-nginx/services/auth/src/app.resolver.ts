// import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Resolver, Query } from '@nestjs/graphql';

// @Controller()
@Resolver()
export class AppResolver {
  // appService;

  constructor(private readonly appService: AppService) {
    // this.appService = appService;
  }

  // @Get('/products/buy')
  // buyProduct(): string {
  //   return this.appService.getHello();
  // }

  // import시 '@nestjs/common'에서 가져오는거 아니니 주의
  @Query(() => String)
  login() {
    return 'login 성공!!';
  }
}
