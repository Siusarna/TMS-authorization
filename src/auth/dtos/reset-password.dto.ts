import { OmitType } from '@nestjs/swagger';
import { SignUpDto } from './sign-up.dto';
import { IsString, Length, Matches } from 'class-validator';
import { IsCommonPassword } from '../../custom-decorators/validators/is-common-password.decorator';

export class ResetPasswordDto extends OmitType(SignUpDto, ['email'] as const) {
  @IsString()
  @Length(8, 64)
  @Matches(
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[@$!%*?&])[\p{Ll}\p{Lu}\d@$!%*?&]{8,64}$/u,
  )
  @IsCommonPassword()
  oldPassword: string;
}
