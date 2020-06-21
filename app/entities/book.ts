import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import ReaderBook from './reader_book';

@Entity({ name: 'bk_books' })
export default class Book {
  @PrimaryColumn({ type: 'varchar', length: 13 })
  isbn: string;

  @Column({ type: 'varchar', length: 16 })
  name: string;

  @Column({ type: 'date', default: null, name: 'publish_date' })
  publishDate: Date;

  @Column({ type: 'varchar', length: 128, default: null })
  cover: string;

  @Column({ type: 'varchar', length: 64, default: null })
  author: string;

  @Column({ type: 'varchar', length: 128, default: null })
  publisher: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(type => ReaderBook, readerBook => readerBook.reader)
  readerBooks: ReaderBook[];
}
