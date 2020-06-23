import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import Book from './book';
import Reader from './reader';
import Punishment from './punishment';

@Entity({ name: 'bk_reader_book' })
export default class ReaderBook extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  uuid: string;

  @ManyToOne(type => Reader, reader => reader.reader_books, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_card' })
  reader: Reader;

  @ManyToOne(type => Book, book => book.reader_books, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'isbn' })
  book: Book;

  @Column({ name: 'return_date', type: 'datetime' })
  return_date: Date;

  // 0 未归还 1 已归还
  @Column({ type: 'int', default: 0 })
  returned: number;

  @OneToMany(type => Punishment, punishment => punishment.record, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  punishments: Punishment[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
