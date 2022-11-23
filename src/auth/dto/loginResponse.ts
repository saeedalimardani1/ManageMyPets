import { Field, ObjectType } from '@nestjs/graphql';
import { Owner } from 'src/owners/entities/owner.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field({ nullable: true })
  owner: Owner;
}
