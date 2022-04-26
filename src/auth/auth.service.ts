import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import { CryptoService } from '../utils/crypto/crypto.service';
import { cryptoConfig, jwtConfig } from '../config';
import { Tokens } from './interfaces/tokens.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cryptoHelper: CryptoService,
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

  async signUp({ email, password }: SignUpDto): Promise<Tokens> {
    const potentialUser = await this.usersRepository.findOne({ email });
    if (potentialUser) {
      throw new UnprocessableEntityException(
        'User with email has already exists',
      );
    }
    const hashedPassword = await this.cryptoHelper.hashing(password);
    const { encrypted: encryptedPassword, iv } =
      await this.cryptoHelper.encryptPassword(
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
