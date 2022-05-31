import { IsString } from 'class-validator';

export class TokenDto {
  /**
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjUzOTM1OTkxLCJleHAiOjE2NTM5Mzk1OTF9.PvnKXtE5axcjlGphbKcopiKjbH5Y4YHGiqc7NWvZ71A
   */
  @IsString()
  accessToken: string;
}
