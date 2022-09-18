import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StarbucksService } from './starbucks.service';
import { CreateStarbucksInput } from './dto/createStarbucks.Input';
import { Starbucks } from './entities/starbucks.entity';

@Resolver()
export class StarbucksResolver {
  constructor(private readonly starbucksService: StarbucksService) {}

  @Query(() => [Starbucks]) // @nestjs/graphql 임포트해야 함. @nestjs/common 아님
  fetchStarbucks() {
    return this.starbucksService.findAll();
  }

  @Mutation(() => String)
  createStarbucks(
    // @Args('writer') writer: string,
    // @Args('title') title: string,
    // @Args('contents') contents: string,
    // @Args('createStarbucksInput') createStarbucksInput: CreateStarbucksInput,
    @Args({ name: 'createStarbucksInput', nullable: true })
    createStarbucksInput: CreateStarbucksInput,
  ) {
    return this.starbucksService.create({ createStarbucksInput });
  }
}
