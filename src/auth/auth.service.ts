import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import { CryptoService } from '../utils/crypto/crypto.service';
import { cryptoConfig, jwtConfig } from '../config';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import * as argon2 from 'argon2';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Token } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  private generateTokens(userId: number): Token {
    return {
      accessToken: this.jwtService.sign(
        { id: userId },
        { expiresIn: jwtConfig.accessExpiresIn },
      ),
    };
  }

  async verifyToken(token: string): Promise<number> {
    try {
      const payload = await this.jwtService.verify(token);
      return payload.id;
    } catch (e) {
      throw new UnauthorizedException('Jwt verification is failed');
    }
  }

  private async isUserPassword(
    iv: string,
    passwordFromDb: string,
    enteredPassword: string,
  ) {
    const arrIv = Uint8Array.from(iv.split(',').map(Number));
    const decryptedPassword = this.cryptoService.decryptPassword(
      passwordFromDb,
      cryptoConfig.cipherPasswordKey,
      arrIv,
    );
    if (!(await argon2.verify(decryptedPassword, enteredPassword))) {
      throw new BadRequestException('Login failed; Invalid email or password.');
    }
  }

  async resetPassword(
    userId: number,
    { password, oldPassword }: ResetPasswordDto,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ id: userId });
    await this.isUserPassword(user.iv, user.password, oldPassword);
    const hashedPassword = await this.cryptoService.hashing(password);
    const { encrypted: encryptedPassword, iv } =
      await this.cryptoService.encryptPassword(
        hashedPassword,
        cryptoConfig.cipherPasswordKey,
      );
    await this.usersRepository.update(
      { id: userId },
      { iv, password: encryptedPassword },
    );
  }

  async signIn({ email, password }: SignInDto): Promise<Token> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException("User with this email doesn't exists");
    }
    await this.isUserPassword(user.iv, user.password, password);
    return this.generateTokens(user.id);
  }

  async signUp({ email, password }: SignUpDto): Promise<Token> {
    const potentialUser = await this.usersRepository.findOne({ email });
    if (potentialUser) {
      throw new UnprocessableEntityException(
        'User with this email has already exists',
      );
    }
    const hashedPassword = await this.cryptoService.hashing(password);
    const { encrypted: encryptedPassword, iv } =
      await this.cryptoService.encryptPassword(
        hashedPassword,
        cryptoConfig.cipherPasswordKey,
      );
    const user = new User({
      email,
      password: encryptedPassword,
      iv,
      passwordVersion: cryptoConfig.passwordVersion,
    });
    const savedUser = await this.usersRepository.save(user);
    return this.generateTokens(savedUser.id);
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User with this id not found');
    }
    return user;
  }
}
