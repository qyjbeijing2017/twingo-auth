import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  updatedAt: Date;
}
