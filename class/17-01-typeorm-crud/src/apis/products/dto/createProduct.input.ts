import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator'; // class-validator , class-transformer 라이브러리 설치하여 입력값 검증. 범위도 설정 가능?

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  price: number;
}
