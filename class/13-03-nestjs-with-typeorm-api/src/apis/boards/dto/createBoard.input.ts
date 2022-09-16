import { Field, InputType } from '@nestjs/graphql';

@InputType() // GraphQL 용 입력 타입, 플레이 그라운드나 클라이언트에서 이 이름으로 보내야 함.
export class CreateBoardInput {
  @Field(() => String)
  writer: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
