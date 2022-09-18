import { Field, InputType, Int } from '@nestjs/graphql';

@InputType() // GraphQL 용 입력 타입, 플레이 그라운드나 클라이언트에서 이 이름으로 보내야 함.
export class CreateStarbucksInput {
  @Field(() => String)
  menu: string;

  @Field(() => Int)
  price: number;

  @Field(() => Int)
  kcal: number;

  @Field(() => Int)
  saturated_fat: number;

  @Field(() => Int)
  protein: number;

  @Field(() => Int)
  salt: number;

  @Field(() => Int)
  sugar: number;

  @Field(() => Int)
  caffeine: number;
}
