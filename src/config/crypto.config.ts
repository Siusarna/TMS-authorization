import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(__dirname, '..', `${env}.env`);
dotenv.config({ path: dotenv_path });

const CryptoConfig = {
  cipherPasswordKey: process.env.CIPHER_PASSWORD_KEY,
  cipherPasswordName: 'aes-256-cbc',
  passwordVersion: process.env.PASSWORD_VERSION,
};

export default CryptoConfig;
