import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Version,
  Request,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from './auth.guards';
import { Token } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('sign-up')
  signUp(@Body() authInfo: SignUpDto): Promise<Token> {
    return this.authService.signUp(authInfo);
  }

  @Version('1')
  @Post('sign-in')
  signIn(@Body() authInfo: SignInDto): Promise<Token> {
    return this.authService.signIn(authInfo);
  }

  @Version('1')
  @Patch('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Request() req,
    @Body() passwords: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(req.user, passwords);
    return;
  }
}
