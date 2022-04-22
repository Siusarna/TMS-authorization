import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsCommonPassword } from '../../custom-decorators/validators/is-common-password.decorator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 64)
  @Matches(
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[@$!%*?&])[\p{Ll}\p{Lu}\d@$!%*?&]{8,64}$/u,
  )
  @IsCommonPassword()
  password: string;
}
