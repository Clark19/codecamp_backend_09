import { InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserSubtitlesInput } from './createUserSubtitles.input';

@InputType()
export class UpdateUserSubtitlesInput extends PartialType(
  CreateUserSubtitlesInput,
) {
  //
}
