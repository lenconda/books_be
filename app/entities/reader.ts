import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import ReaderBook from './reader_book';

@Entity({ name: 'bk_readers' })
export default class Reader extends BaseEntity {
  @PrimaryColumn({ name: 'id_card', type: 'varchar', length: 18 })
  id_card: string;

  @Column({ type: 'varchar', length: 16 })
  name: string;

  // 为避免性别歧视的嫌疑，默认性别缺省值为 null
  // 0=男，1=女
  @Column({ type: 'int', default: null })
  gender: number;

  @Column({ type: 'varchar', length: 64, default: null })
  address: string;

  @Column({ type: 'varchar', length: 11, default: null })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(type => ReaderBook, readerBook => readerBook.reader, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  reader_books: ReaderBook[];
}
