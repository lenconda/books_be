import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'bk_admins' })
export default class Admin extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  uuid: string;

  @Column({ type: 'varchar', length: 16 })
  username: string;

  @Column({ type: 'varchar', length: 16 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
