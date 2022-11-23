import { UseGuards } from '@nestjs/common';
import { Args, GqlArgumentsHost, Mutation, Resolver } from '@nestjs/graphql';
import { Owner } from 'src/owners/entities/owner.entity';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { LoginResponse } from './dto/loginResponse';
import { GqlAuthGuard } from './gqlAuthGuard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => Owner)
  signUp(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.signUp(loginUserInput);
  }
}
