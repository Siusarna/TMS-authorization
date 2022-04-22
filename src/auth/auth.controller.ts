import { Body, Controller, Post } from '@nestjs/common';
import { Tokens } from './interfaces/tokens.interface';
import { AuthInfoDto } from './dtos/auth-info.dto';

@Controller('auth')
export class AuthController {
  @Post()
  signUp(@Body() authInfo: AuthInfoDto): Tokens {
    return {
      accessToken: 'b',
      refreshToken: 'd',
    };
  }
}
