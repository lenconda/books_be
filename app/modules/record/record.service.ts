import { Service } from 'typedi';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError, NotFoundError,
} from 'routing-controllers';
import Book from '../../entities/book';
import Reader from '../../entities/reader';
import ReaderBook from '../../entities/reader_book';
import { uuid } from '../../utils/uuid';
import { getRepository, Repository, Like, FindOperator } from 'typeorm';

@Service()
export default class RecordService {
  private bookRepository: Repository<Book>;
  private readerRepository: Repository<Reader>;
  private readerBookRepository: Repository<ReaderBook>;
  private message = new StatusMessage('图书');

  constructor() {
    this.bookRepository = getRepository(Book);
    this.readerRepository = getRepository(Reader);
    this.readerBookRepository = getRepository(ReaderBook);
  }

  /**
   * 借出图书
   * @param isbn ISBN 号
   * @param idCard 读者身份证号
   * @param returnDate 归还日期
   */
  async lend(isbn: string, idCard: string, returnDate: Date): Promise<any> {
    try {
      const book = await this.bookRepository.findOne({ isbn });
      const reader = await this.readerRepository.findOne({ idCard });

      if (!book || !reader) {
        throw new NotFoundError('图书借出失败，未找到图书或读者');
      }

      const readerBook = new ReaderBook();
      readerBook.uuid = uuid();
      readerBook.reader = idCard;
      readerBook.book = isbn;
      readerBook.returnDate = returnDate;

      await this.readerBookRepository.insert(readerBook);

      return readerBook;
    } catch (e) {
      throw new BadRequestError('图书借出失败');
    }
  }

  /**
   * 归还图书
   * @param uuid 借阅单 UUID
   */
  async return(uuid: string): Promise<any> {
    try {
      const readerBook = await this.readerBookRepository.findOne({ uuid });

      if (!readerBook) {
        throw new NotFoundError('未找到此借阅记录');
      }

      readerBook.returned = 1;
      readerBook.returnDate = new Date();
      readerBook.save();

      return readerBook;
    } catch (e) {
      throw new BadRequestError('图书归还失败');
    }
  }

  /**
   * 获取一条借阅信息
   * @param isbn ISBN 号
   */
  async detail(uuid: string): Promise<any> {
    try {
      const result = await this.readerBookRepository.findOne({ uuid }, { relations: ['punishments'] });
      return result;
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }

  /**
   * 查询符合条件的所有借阅信息
   * @param query 查询内容
   * @param page 页码
   * @param size 每页大小
   */
  async query(query: Record<string, any>, page = 1, size = 10) {
    try {
      const options = Object.keys(query).reduce((result: Record<string, FindOperator<string>>, key: string) => {
        result[key] = Like(`%${query[key]}%`);
        return result;
      }, {});
      const [result, total] = await this.readerBookRepository.findAndCount({
        where: options,
        take: size,
        skip: (page - 1) * size,
      });
      return {
        items: result,
        total,
      };
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }
}
