import * as fs from 'fs';

const topPasswords = fs
  .readFileSync(`${__dirname}/top-10000-passwords.txt`)
  .toString()
  .split('\r\n');

export default (password: string): boolean => {
  return topPasswords.includes(password);
};
