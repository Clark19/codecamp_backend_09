import { Field, InputType, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateUserSubtitlesInput {
  @Field(() => String)
  youtubeInfoId: string;

  @Field(() => String, { nullable: true })
  subtitlesEn: string;

  @Field(() => String, { nullable: true })
  subtitlesKo: string;

  @Field(() => GraphQLJSON, { nullable: true })
  subtitlesWithTime: JSON;

  // @Field(() => String, { nullable: true })
  // userId: string;

  @Field(() => [String], { nullable: true })
  imgUrls: string[];
}
