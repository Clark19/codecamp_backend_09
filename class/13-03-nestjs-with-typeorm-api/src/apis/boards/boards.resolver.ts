import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardsService } from './boards.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  // @Query(() => String, { nullable: true })
  // getHello(): string {
  //   return this.boardsService.getHello();
  // }

  @Query(() => [Board]) // @nestjs/graphql 임포트해야 함. @nestjs/common 아님
  fetchBoards() {
    return this.boardsService.findAll();
  }

  @Mutation(() => String)
  createBoard(
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args('contents') contents: string,
    // @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args({ name: 'createBoardInput', nullable: true })
    createBoardInput: CreateBoardInput,
  ) {
    return this.boardsService.create({ createBoardInput });
  }
}
