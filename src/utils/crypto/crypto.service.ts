import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as crypto from 'crypto';
import { cryptoConfig } from '../../config';
import * as argon2 from 'argon2';

const promisifiedRandomFill = promisify(crypto.randomFill);

@Injectable()
export class CryptoService {
  async encryptPassword(data, key) {
    const iv = (await promisifiedRandomFill(
      new Uint8Array(16),
    )) as crypto.BinaryLike;
    const aes = crypto.createCipheriv(cryptoConfig.cipherPasswordName, key, iv);
    let encrypted = aes.update(data, 'utf8', 'hex');
    encrypted += aes.final('hex');

    return { encrypted, iv: iv.toString() };
  }

  decryptPassword(data, key, iv) {
    const aes = crypto.createDecipheriv(
      cryptoConfig.cipherPasswordName,
      key,
      iv,
    );
    let decrypted = aes.update(data, 'hex', 'utf-8');
    decrypted += aes.final('utf-8');

    return decrypted;
  }

  hashing(data) {
    return argon2.hash(data, {
      type: argon2.argon2id,
      memoryCost: 1024 * 37,
      parallelism: 1,
      hashLength: 50,
    });
  }
}
