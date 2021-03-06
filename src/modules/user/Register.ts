
import { Resolver, Query, Mutation, Arg, /* Authorized, */ UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { isAuth } from './../../middleware/isAuth';
import { logger } from './../../middleware/logger';
import { RegisterInput } from './register/RegisterInput';
import { User } from './../../entity/User';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationUrl } from '../utils/createConfirmationUrl';

@Resolver()
export class RegisterResolver {
 /*  @Authorized() */
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return 'hello world';
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    await sendEmail(email, await createConfirmationUrl(user.id))

    return user;
  }
}
