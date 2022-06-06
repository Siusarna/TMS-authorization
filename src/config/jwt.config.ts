import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(__dirname, '..', `${env}.env`);
dotenv.config({ path: dotenv_path });

const JwtConfig = {
  secretKey: process.env.JWT_SECRET_KEY,
  accessExpiresIn: '60m',
  refreshExpiresIn: '120m',
};

export default JwtConfig;
