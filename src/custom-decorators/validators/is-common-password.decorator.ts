import { registerDecorator, ValidationOptions } from 'class-validator';
import isCommonPassword from '../../utils/is-common-password';

export function IsCommonPassword(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isCommonPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate() {
          const value = object[propertyName];
          return !isCommonPassword(value);
        },
        defaultMessage(): string {
          return 'This password is common';
        },
      },
    });
  };
}
