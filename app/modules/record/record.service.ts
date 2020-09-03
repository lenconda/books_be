import { Service } from 'typedi';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError, NotFoundError,
} from 'routing-controllers';
import Book from '../../entities/book';
import Reader from '../../entities/reader';
import ReaderBook from '../../entities/reader_book';
import { uuid } from '../../utils/uuid';
import { punishment } from '../../utils/punishment';
import { getRepository, Repository, Like, FindOperator, Between } from 'typeorm';
import moment from 'moment';

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
      const reader = await this.readerRepository.findOne({ id_card: idCard });

      if (!book || !reader) {
        throw new NotFoundError('图书借出失败，未找到图书或读者');
      }

      if (book.count === 0) {
        throw new BadRequestError('图书库存不足，无法借出');
      }

      const readerBook = new ReaderBook();
      readerBook.uuid = uuid();
      readerBook.reader = reader;
      readerBook.book = book;
      readerBook.return_date = returnDate;

      await this.readerBookRepository.insert(readerBook);
      book.count = book.count - 1;
      await book.save();

      return readerBook;
    } catch (e) {
      if (e instanceof NotFoundError || e instanceof BadRequestError) {
        throw e;
      }
      throw new BadRequestError('图书借出失败');
    }
  }

  /**
   * 归还图书
   * @param uuid 借阅单 UUID
   */
  async return(uuid: string): Promise<any> {
    try {
      const readerBook = await this.readerBookRepository.findOne({ uuid }, { relations: ['book'] });

      if (!readerBook) {
        throw new NotFoundError('未找到此借阅记录');
      }

      readerBook.returned = 1;
      readerBook.return_date = new Date();
      readerBook.save();

      const book = readerBook.book;
      book.count = book.count + 1;
      await book.save();

      return '图书归还成功';
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new BadRequestError('图书归还失败');
    }
  }

  /**
   * 获取一条借阅信息
   * @param isbn ISBN 号
   */
  async detail(uuid: string): Promise<any> {
    try {
      const result = await this.readerBookRepository.findOne({ uuid }, { relations: ['punishments', 'reader', 'book'] });
      return {
        ...result,
        amount: (Date.parse(result.return_date.toString()) < Date.now() && !result.returned) ? punishment(result.return_date) : 0,
        paid: !result.punishments.length ? 0 : result.punishments.reduce((total, current) => {
          const amount = total + current.amount;
          return amount;
        }, 0),
      };
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
        if (Array.isArray(query[key]) && query[key].length === 2) {
          const [ start, end ] = query[key];
          const realStart = moment(start).utc(false).startOf('day').toISOString();
          const realEnd = moment(end).utc(false).add(2, 'day').startOf('day').toISOString();
          result[key] = Between(realStart, realEnd);
        } else {
          result[key] = Like(`%${query[key]}%`);
        }
        return result;
      }, {});
      const [result, total] = await this.readerBookRepository.findAndCount({
        where: options,
        take: size,
        skip: (page - 1) * size,
        relations: ['punishments', 'reader', 'book'],
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
