/* eslint-disable prettier/prettier */
import { ObjectType, Field } from '@nestjs/graphql';
import { Pet } from 'src/pets/entities/pet.entity';
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Owner {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ nullable: true })
  @Field()
  username: string;

  @Column({ nullable: true })
  @Field()
  password: string;

  @JoinTable()
  @OneToMany((type) => Pet, (pet) => pet.owner)
  @Field(() => [Pet], { nullable: true })
  pets?: Promise<Pet[]>;
}
