import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import ReaderBook from './reader_book';

@Entity({ name: 'bk_books' })
export default class Book extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  isbn: string;

  @Column({ type: 'varchar', length: 16 })
  name: string;

  @Column({ type: 'datetime', default: null, name: 'publish_date' })
  publish_date: Date;

  @Column({ type: 'varchar', length: 128, default: null })
  cover: string;

  @Column({ type: 'varchar', length: 64, default: null })
  author: string;

  @Column({ type: 'varchar', length: 128, default: null })
  publisher: string;

  @Column({ type: 'int', default: 0 })
  count: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(type => ReaderBook, readerBook => readerBook.reader, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  reader_books: ReaderBook[];
}
