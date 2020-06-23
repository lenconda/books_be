import { Service } from 'typedi';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError,
} from 'routing-controllers';
import Reader from '../../entities/reader';
import { getRepository, Repository, Like, FindOperator } from 'typeorm';

@Service()
export default class ReaderService {
  private readerRepository: Repository<Reader>;
  private message = new StatusMessage('读者');

  constructor() {
    this.readerRepository = getRepository(Reader);
  }

  /**
   * 添加读者
   * @param idCard 身份证号
   * @param name 姓名
   * @param gender 性别，0 男 1 女
   * @param address 地址
   * @param phone 电话
   */
  async add(
    idCard: string,
    name: string,
    gender: number = null,
    address: string = null,
    phone: string = null,
  ): Promise<any> {
    try {
      const reader = new Reader();
      reader.id_card = idCard;
      reader.name = name;
      reader.gender = gender;
      reader.address = address;
      reader.phone = phone;

      await this.readerRepository.insert(reader);

      return reader;
    } catch (e) {
      throw new BadRequestError(this.message.create(false, e.message || e.error.message));
    }
  }

  /**
   * 编辑读者信息
   * @param idCard 身份证号
   * @param updateInfo 要更新的内容
   */
  async edit(idCard: string, updateInfo: Record<string, any>): Promise<any> {
    if (!idCard) {
      throw new BadRequestError(this.message.edit(false, '未填写身份证号'));
    }

    try {
      const result = await this.readerRepository.update({ id_card: idCard }, updateInfo);
      return result;
    } catch (e) {
      throw new BadRequestError(this.message.edit(false, e.message || e.error.message));
    }
  }

  /**
   * 删除读者信息
   * @param idCard 身份证号
   */
  async delete(idCard: string): Promise<any> {
    try {
      await this.readerRepository.delete({ id_card: idCard });
      return this.message.delete(true);
    } catch (e) {
      throw new BadRequestError(this.message.delete(false, e.message || e.error.message));
    }
  }

  /**
   * 获取一个读者信息
   * @param idCard 身份证号
   */
  async detail(idCard: string): Promise<any> {
    try {
      const result = await this.readerRepository.findOne({ id_card: idCard });
      return result;
    } catch (e) {
      throw new BadRequestError(this.message.query(false, e.message || e.error.message));
    }
  }

  /**
   * 查询符合条件的所有读者信息
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
      const [result, total] = await this.readerRepository.findAndCount({
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
