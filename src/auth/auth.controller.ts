import { Body, Controller, Post, Version } from '@nestjs/common';
import { Tokens } from './interfaces/tokens.interface';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('sign-up')
  signUp(@Body() authInfo: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(authInfo);
  }
}
