import { Length, IsEmail } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { IsEmailAlreadyExist } from './isEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 30)
  firstName: string;

  @Field()
  @Length(1, 30)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({message: "email alread in use"})
  email: string;

  @Field()
  password: string;
}
