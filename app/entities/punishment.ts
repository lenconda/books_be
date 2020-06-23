import { Entity, Column, PrimaryColumn, CreateDateColumn, BaseEntity, ManyToOne } from 'typeorm';
import ReaderBook from './reader_book';

@Entity({ name: 'bk_punishments' })
export default class Punishment extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  uuid: string;

  @ManyToOne(type => ReaderBook, readerBook => readerBook.uuid, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  record: ReaderBook;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
