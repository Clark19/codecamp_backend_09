import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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

  @Query(() => User)
  fetchUser(@Args('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Mutation(() => User)
  createUser(
    // @Args('email') email: string,
    // @Args({ name: 'age', type: () => Int }) age: number,
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    // 수정 가능 확인 로직
    // await this.usersService.checkEditable(userId);

    // 수정하기: 수정 전 수정 가능 상태인지 검증 후 실행
    return this.usersService.update({
      userId,
      updateUserInput,
    });
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.delete(userId);
  }

  @Mutation(() => Boolean)
  restoreUser(
    @Args('userId') userId: string, //
  ) {
    return this.usersService.restore(userId);
  }
}
