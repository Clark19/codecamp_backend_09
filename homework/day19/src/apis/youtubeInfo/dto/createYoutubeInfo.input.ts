import { Field, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
// import { Min } from 'class-validator'; // class-validator , class-transformer 라이브러리 설치하여 입력값 검증. 범위도 설정 가능?

@InputType()
export class CreateYoutubeInfoInput {
  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  subtitlesEn: string;

  @Field(() => String, { nullable: true })
  subtitlesKo: string;

  @Field(() => GraphQLJSON, { nullable: true })
  subtitlesWithTime: JSON;

  @Field(() => Boolean, { nullable: true })
  isEditable?: boolean;

  // @Min(0)
  // @Field(() => Int)
  // price: number;

  @Field(() => String)
  categoryId: string;
}
