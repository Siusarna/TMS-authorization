import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IsCommonPassword } from '../../common/decorators/validators/is-common-password.decorator';
import { IsMatch } from '../../common/decorators/validators/IsMatch.decorator';

export class SignUpDto {
  /**
   * @example test@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * @example J23498asd!
   */
  @IsString()
  @Length(8, 64)
  @Matches(
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[@$!%*?&])[\p{Ll}\p{Lu}\d@$!%*?&]{8,64}$/u,
  )
  @IsCommonPassword()
  password: string;

  /**
   * @example J23498asd!
   */
  @IsString()
  @IsMatch('password')
  passwordConfirm: string;
}
