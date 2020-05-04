import { ObjectType, Field, ID, Root } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  firstName: string;

  @Field()
  @Column('text')
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column('text')
  password: string;
}
