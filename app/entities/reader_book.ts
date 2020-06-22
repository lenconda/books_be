import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import Book from './book';
import Reader from './reader';
import Punishment from './punishment';

@Entity({ name: 'bk_reader_book' })
export default class ReaderBook extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  uuid: string;

  @ManyToOne(type => Reader, reader => reader.readerBooks, { cascade: true })
  @JoinColumn({ name: 'id_card' })
  reader: string;

  @ManyToOne(type => Book, book => book.readerBooks, { cascade: true })
  @JoinColumn({ name: 'isbn' })
  book: string;

  @Column({ name: 'return_date', type: 'date' })
  returnDate: Date;

  @Column({ type: 'int' })
  returned: number;

  @OneToMany(type => Punishment, punishment => punishment.record)
  punishments: Punishment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
