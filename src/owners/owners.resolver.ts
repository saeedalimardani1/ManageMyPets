import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { OwnersService } from './owners.service';
import { Owner } from './entities/owner.entity';
import { CreateOwnerInput } from './dto/create-owner.input';
import { UpdateOwnerInput } from './dto/update-owner.input';
import { Pet } from 'src/pets/entities/pet.entity';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver(() => Owner)
@UseGuards(JwtAuthGuard)
export class OwnersResolver {
  constructor(private readonly ownersService: OwnersService) {}

  @Query(() => [Owner], { name: 'owners' })
  async findAll() {
    return await this.ownersService.findAll();
  }

  @Query(() => Owner, { name: 'owner' })
  findOne(@Context() context) {
    return this.ownersService.findOne(context.req.user.userId);
  }

  @ResolveField(() => [Pet])
  async pets(@Parent() owner: Owner, @Context() context) {
    return await owner.pets;
  }

  @Mutation(() => Owner)
  updateOwner(
    @Args('updateOwnerInput') updateOwnerInput: UpdateOwnerInput,
    @Context() context,
  ) {
    return this.ownersService.update(context.req.user.userId, updateOwnerInput);
  }

  @Mutation(() => Owner)
  removeOwner(@Args('id', { type: () => Int }) id: number) {
    return this.ownersService.remove(id);
  }
}
