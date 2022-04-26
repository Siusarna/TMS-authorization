import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import { CryptoService } from '../utils/crypto/crypto.service';
import { cryptoConfig, jwtConfig } from '../config';
import { Tokens } from './interfaces/tokens.interface';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  private generateTokens(id: number): Tokens {
    return {
      accessToken: this.jwtService.sign(
        { id },
        { expiresIn: jwtConfig.accessExpiresIn },
      ),
      refreshToken: this.jwtService.sign(
        { id },
        { expiresIn: jwtConfig.refreshExpiresIn },
      ),
    };
  }

  async signIn({ email, password }: SignInDto): Promise<Tokens> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new NotFoundException("User with this email doesn't exists");
    }
    const arrIv = Uint8Array.from(user.iv.split(',').map(Number));
    const decryptedPassword = this.cryptoService.decryptPassword(
      user.password,
      cryptoConfig.cipherPasswordKey,
      arrIv,
    );
    if (!(await argon2.verify(decryptedPassword, password))) {
      throw new BadRequestException('Login failed; Invalid email or password.');
    }
    return this.generateTokens(user.id);
  }

  async signUp({ email, password }: SignUpDto): Promise<Tokens> {
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
}
