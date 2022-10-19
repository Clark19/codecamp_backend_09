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

  @Query(() => String)
  fetchBoards() {
    return '데이터 보내기 성공';
  }
}
