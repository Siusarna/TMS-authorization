import { Body, Controller, Post, Version } from '@nestjs/common';
import { Tokens } from './interfaces/tokens.interface';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('sign-up')
  signUp(@Body() authInfo: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(authInfo);
  }

  @Version('1')
  @Post('sign-in')
  signIn(@Body() authInfo: SignInDto): Promise<Tokens> {
    return this.authService.signIn(authInfo);
  }
}
