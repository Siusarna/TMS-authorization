import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config';
import { AuthService } from './auth.service';
import { CryptoModule } from '../utils/crypto/crypto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConfig.secretKey,
    }),
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
