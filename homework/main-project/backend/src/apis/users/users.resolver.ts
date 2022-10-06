import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.usersService.findAllWithDeleted();
  }

  // @Query(() => User)
  // fetchUser(@Args('userId') userId: string) {
  //   return this.usersService.findOne(userId);
  // }
  // @Query(() => User)
  // fetchUser(@Args('email') email: string) {
  //   return this.usersService.findOne(email);
  // }

  /*  @UseGuards() nestjs가 제공하는 인가(authorization)임.
       AuthGuard("qqq")는 nestjs/passport에서 제공하는 인가임. 
          실질적인 내용은 src/commons/auth/jwt-access.strategy.ts 파일에서 작성하고 인가시 그 파일 로직 호출 됨.
       AuthGuard("qqq")안의 "qqq"는 jwt-access.strategy.ts에서 설정한 name임.
   */
  // @UseGuards(AuthGuard('qqq')) // Rest API는 @UseGuards 데코레이터랑 ../commons/auth/jwt-access.strategy.ts 파일까지만 작성하면되고,
  // GraphQl은 파일 하나 더 만들어야 함. gql-auth.guard.ts
  @UseGuards(GqlAuthAccessGuard) // request를 graphql request로 빠꿔치기 해주는 부분
  @Query(() => User)
  fetchLoginUser(
    @Context() context: IContext, // context는 nestjs가 제공하는 것임. req, res, next 등을 가지고 있음.
  ) {
    // 유저 정보 꺼내오기
    console.log(context.req.user); // { email: "
    console.log('fetchUser 실행완료');
    // return 'fetchUser가 실행되었습니다!';
    return this.usersService.findOne(context.req.user.email);
  }

  @Mutation(() => User)
  async createUser(
    // @Args('email') email: string,
    // @Args({ name: 'age', type: () => Int }) age: number,
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create({
      ...createUserInput,
      // password: hashedPassword,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() ctx: any,
  ) {
    // 수정 가능 확인 로직
    // await this.usersService.checkEditable(userId);

    const { password } = updateUserInput;
    if (password) {
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
      // const hashedPassword = await bcrypt.hash(password, salt);
      updateUserInput.password = String(await bcrypt.hash(password, salt));
    }

    // 수정하기: 수정 전 수정 가능 상태인지 검증 후 실행
    return this.usersService.update({
      userId,
      updateUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUserPwd(
    @Args('userId') userId: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ) {
    // fe에서 전달한 user 식별자랑 jwt 토큰에 담긴 user 식별자랑 다르면 Exception 리턴
    if (userId !== ctx.req.user.userId)
      new UnauthorizedException(
        '로그인한 회원의 정보는 본인만 수정 가능합니다.',
      );
    // return this.usersService.updatePassword(userId, hashedPassword);
    return this.updateUser(userId, { password }, ctx);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(
    @Args('userId') userId: string, //
    @Context() ctx: any,
  ) {
    return this.usersService.delete(userId);
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(
    @Args('userId') userId: string, //
    @Context() ctx: any,
  ) {
    if (userId !== ctx.req.user.userId)
      new UnauthorizedException('로그인한 회원정보 삭제는 본인만 가능합니다.');

    return this.deleteUser(userId, ctx);
  }

  @Mutation(() => Boolean)
  restoreUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.restore(userId);
  }
}
