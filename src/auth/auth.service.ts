import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dtos/sign-up.dto';
import { CryptoHelper } from '../utils/crypto-helper';
import { cryptoConfig } from '../config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private cryptoHelper: CryptoHelper,
  ) {}

  async signUp({ email, password }: SignUpDto): Promise<void> {
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
    const user = new User({ email, password: encryptedPassword, iv, passwordVersion: cryptoConfig.passwordVersion });
    const savedUser = await this.usersRepository.save(user);
  }
}
