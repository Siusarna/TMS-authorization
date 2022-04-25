import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  passwordVersion: string;

  @Column()
  iv: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
