import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  /*  @UseGuards() nestjs가 제공하는 인가(authorization)임.
       AuthGuard("qqq")는 nestjs/passport에서 제공하는 인가임. 
          실질적인 내용은 src/commons/auth/jwt-access.strategy.ts 파일에서 작성하고 인가시 그 파일 로직 호출 됨.
       AuthGuard("qqq")안의 "qqq"는 jwt-access.strategy.ts에서 설정한 name임.
   */
  // @UseGuards(AuthGuard('qqq')) // Rest API는 @UseGuards 데코레이터랑 ../commons/auth/jwt-access.strategy.ts 파일까지만 작성하면되고, GraphQl은 파일 하나 더 만들어야 함. gql-auth.guard.ts
  @UseGuards(GqlAuthAccessGuard) // request를 graphql request로 빠꿔치기 해주는 부분
  @Query(() => String)
  fetchUser(
    @Context() context: IContext, // context는 nestjs가 제공하는 것임. req, res, next 등을 가지고 있음.
  ) {
    // 유저 정보 꺼내오기
    console.log(context.req.user); // { email: "
    console.log('fetchUser 실행완료');
    return 'fetchUser가 실행되었습니다!';
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    return this.usersService.create({ email, hashedPassword, name, age });
  }
}
