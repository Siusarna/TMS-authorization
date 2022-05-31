import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from './auth.guards';
import {
  TransformUserInterceptor,
} from '../common/interceptors/transform-user.interceptor';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('sign-up')
  signUp(@Body() authInfo: SignUpDto) {
    return this.authService.signUp(authInfo);
  }

  @Version('1')
  @Post('sign-in')
  signIn(@Body() authInfo: SignInDto) {
    return this.authService.signIn(authInfo);
  }

  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Patch('reset-password')
  @UseGuards(AuthGuard)
  async resetPassword(
    @Request() req,
    @Body() passwords: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(req.user, passwords);
    return;
  }

  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Get('user')
  @UseGuards(AuthGuard)
  @UseInterceptors(TransformUserInterceptor)
  getUser(@Request() req) {
    return this.authService.getUser(req.user);
  }
}
