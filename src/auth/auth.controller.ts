import { Body, Controller, Post } from '@nestjs/common';
import { Tokens } from './interfaces/tokens.interface';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  @Post()
  signUp(@Body() authInfo: SignUpDto): Tokens {
    return {
      accessToken: 'b',
      refreshToken: 'd',
    };
  }
}
