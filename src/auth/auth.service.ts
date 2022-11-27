import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OwnersService } from 'src/owners/owners.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class AuthService {
  constructor(
    private ownersService: OwnersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.ownersService.findOneUserByUsername(username);
    if (user) {
      const passCheck = await bcrypt.compare(pass, user.password);
      if (passCheck) {
        const { password, pets, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(loginUserInput: LoginUserInput) {
    const user = await this.ownersService.findOneUserByUsername(
      loginUserInput.username,
    );

    const { password, ...result } = user;
    console.log(result);
    const payload = { user: user.username, userId: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      owner: result,
    };
  }

  async signUp(loginUserInput: LoginUserInput) {
    const user = await this.ownersService.findOneUserByUsername(
      loginUserInput.username,
    );
    if (user) {
      throw new HttpException('user already exists', HttpStatus.FORBIDDEN);
    }
    const password = await bcrypt.hash(loginUserInput.password, 10);
    return this.ownersService.create({ ...loginUserInput, password });
  }
}
