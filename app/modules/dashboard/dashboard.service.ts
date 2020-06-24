import { Service } from 'typedi';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError,
} from 'routing-controllers';
import moment from 'moment';
import ReaderBook from '../../entities/reader_book';
import { getRepository, Repository, Between, LessThan } from 'typeorm';

@Service()
export default class DashboardService {
  private readerBookRepository: Repository<ReaderBook>;
  private message = new StatusMessage('借阅信息');

  constructor() {
    this.readerBookRepository = getRepository(ReaderBook);
  }


  /**
   * 查询一段时间内借阅单数量
   * @param start 开始日期
   * @param end 结束日期
   */
  async count(start: Date, end: Date) {
    try {
      const query = {
        start,
        end,
      };

      if (start.getMilliseconds() === end.getMilliseconds()) {
        query.end = moment(end).add(1, 'day').toDate();
      }

      const [createdResult, created] = await this.readerBookRepository.findAndCount({
        where: {
          created_at: Between(query.start, query.end),
        },
      });

      const [returnedResult, returned] = await this.readerBookRepository.findAndCount({
        where: {
          returned: 1,
          updated_at: Between(query.start, query.end),
        },
      });

      const [delayedResult, delayed] = await this.readerBookRepository.findAndCount({
        where: {
          return_date: LessThan(new Date()),
          returned: 0,
        },
      });

      return {
        created,
        returned,
        delayed,
      };
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }
}
