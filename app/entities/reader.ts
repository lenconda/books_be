import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import ReaderBook from './reader_book';

@Entity({ name: 'bk_readers' })
export default class Reader {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  uuid: string;

  @Column({ type: 'varchar', length: 16 })
  name: string;

  @Column({ type: 'int', default: null })
  gender: number;

  @Column({ type: 'varchar', length: 64, default: null })
  address: string;

  @Column({ type: 'varchar', length: 11, default: null })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(type => ReaderBook, readerBook => readerBook.reader)
  readerBooks: ReaderBook[];
}
