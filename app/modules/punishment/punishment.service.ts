import { Service } from 'typedi';
import {
  BadRequestError,
  NotFoundError,
} from 'routing-controllers';
import ReaderBook from '../../entities/reader_book';
import Punishment from '../../entities/punishment';
import { uuid as genUuid } from '../../utils/uuid';
import { getRepository, Repository } from 'typeorm';

@Service()
export default class PunishmentService {
  private readerBookRepository: Repository<ReaderBook>;
  private punishmentRepository: Repository<Punishment>;

  constructor() {
    this.readerBookRepository = getRepository(ReaderBook);
    this.punishmentRepository = getRepository(Punishment);
  }

  /**
   * 缴纳滞纳金
   * @param uuid 借阅单 UUID
   */
  async pay(uuid: string, amount: number): Promise<any> {
    try {
      const record = await this.readerBookRepository.findOne({ uuid });

      if (!record) {
        throw new NotFoundError('未找到此借阅单');
      }

      const punishment = new Punishment();
      punishment.uuid = genUuid();
      punishment.record = record;
      punishment.amount = amount;

      await this.punishmentRepository.insert(punishment);

      return punishment;
    } catch (e) {
      throw new BadRequestError('缴纳滞纳金失败');
    }
  }
}
