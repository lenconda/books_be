import { Service } from 'typedi';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError,
} from 'routing-controllers';
import Book from '../../entities/book';
import ReaderBook from '../../entities/reader_book';
import { getRepository, Repository, Like, FindOperator } from 'typeorm';

@Service()
export default class BookService {
  private bookRepository: Repository<Book>;
  private readerBookRepository: Repository<ReaderBook>;
  private message = new StatusMessage('图书');

  constructor() {
    this.bookRepository = getRepository(Book);
    this.readerBookRepository = getRepository(ReaderBook);
  }

  /**
   * 图书入库
   * @param isbn ISBN 号
   * @param name 名称
   * @param publishDate 出版日期
   * @param cover 封面 URL
   * @param author 作者
   * @param publisher 出版社
   */
  async add(
    isbn: string,
    name: string,
    publishDate: Date = null,
    cover: string = null,
    author: string = null,
    count = 0,
    publisher: string = null,
  ): Promise<any> {
    try {
      const book = new Book();
      book.isbn = isbn;
      book.name = name;
      book.publish_date = publishDate;
      book.cover = cover;
      book.author = author;
      book.count = count;
      book.publisher = publisher;

      await this.bookRepository.insert(book);

      return book;
    } catch (e) {
      throw new BadRequestError(this.message.create(false, e.message || e.error.message));
    }
  }

  /**
   * 编辑图书信息
   * @param isbn ISBN 号
   * @param updateInfo 要更新的内容
   */
  async edit(isbn: string, updateInfo: Record<string, any>): Promise<any> {
    if (!isbn) {
      throw new BadRequestError(this.message.edit(false, '未填写 ISBN 号'));
    }

    try {
      const result = await this.bookRepository.update({ isbn }, updateInfo);
      return result;
    } catch (e) {
      if (e instanceof BadRequestError) {
        throw e;
      }
      throw new BadRequestError(this.message.edit(false, e.message || e.error.message));
    }
  }

  /**
   * 删除图书信息
   * @param isbn ISBN 号
   */
  async delete(isbn: string): Promise<any> {
    try {
      await this.bookRepository.delete({ isbn });
      return this.message.delete(true);
    } catch (e) {
      throw new BadRequestError(this.message.delete(false, e.message || e.error.message));
    }
  }

  /**
   * 获取一本图书信息
   * @param isbn ISBN 号
   */
  async detail(isbn: string): Promise<any> {
    try {
      const result = await this.bookRepository.findOne({ isbn });
      const [items, total] = await this.readerBookRepository.findAndCount({
        where: { book: isbn, returned: 0 },
      });
      return {
        ...result,
        lent_count: total,
      };
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }

  /**
   * 查询符合条件的所有图书信息
   * @param query 查询内容
   * @param page 页码
   * @param size 每页大小
   */
  async query(query: Record<string, any>, page = 1, size = 10): Promise<any> {
    try {
      const options = Object.keys(query).reduce((result: Record<string, FindOperator<string>>, key: string) => {
        result[key] = Like(`%${query[key]}%`);
        return result;
      }, {});
      const [result, total] = await this.bookRepository.findAndCount({
        where: options,
        take: size,
        skip: (page - 1) * size,
      });
      const books = [];
      for (const item of result) {
        const [items, total] = await this.readerBookRepository.findAndCount({
          where: { book: item.isbn, returned: 0 },
        });
        books.push({
          ...item,
          lent_count: total,
        });
      }
      return { items: books, total };
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }

  /**
   * 简易搜索符合条件的所有图书信息
   * @param keyword 查询内容
   */
  async search(keyword: string) {
    try {
      if (!keyword) {
        return { items: [] };
      }

      const options = ['name', 'isbn', 'author', 'publisher'].map(option =>
        ({ [option]: Like(`%${keyword}%`) }),
      );

      const items = await this.bookRepository.find({
        where: options,
      });

      return {
        items,
      };
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }
}
