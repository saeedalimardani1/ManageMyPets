import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOwnerInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
