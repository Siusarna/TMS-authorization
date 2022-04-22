import fs from 'fs';

const topPasswords = fs
  .readFileSync(`${__dirname}/top10000password.txt`)
  .toString()
  .split('\r\n');

export default (password: string): boolean => {
  return topPasswords.includes(password);
};
