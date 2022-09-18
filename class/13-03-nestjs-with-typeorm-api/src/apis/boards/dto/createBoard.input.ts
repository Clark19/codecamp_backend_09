import { Field, InputType } from '@nestjs/graphql';

@InputType() // GraphQL 용 입력 타입, 플레이 그라운드나 클라이언트에서 이 이름으로 보내야 함.
export class CreateBoardInput {
  @Field(() => String) // graphql 용, gql용 타입
  writer: string; // typescript 용 타입

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
