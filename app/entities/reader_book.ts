import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import Book from './book';
import Reader from './reader';

@Entity({ name: 'bk_reader_book' })
export default class ReaderBook {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  uuid: string;

  @ManyToOne(type => Reader, reader => reader.readerBooks, { cascade: true })
  @JoinColumn({ name: 'uuid' })
  reader: string;

  @ManyToOne(type => Book, book => book.readerBooks, { cascade: true })
  @JoinColumn({ name: 'isbn' })
  book: string;

  @Column({ name: 'return_date', type: 'date' })
  returnDate: Date;

  @Column({ type: 'int' })
  returned: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}