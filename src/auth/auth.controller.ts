import { Body, Controller, Post } from '@nestjs/common';
import { Tokens } from './interfaces/tokens.interface';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  signUp(@Body() authInfo: SignUpDto): Tokens {
    return {
      accessToken: 'b',
      refreshToken: 'd',
    };
  }
}
