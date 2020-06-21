import { Service } from 'typedi';
import md5 from 'md5';
import { StatusMessage } from '../../utils/messages';
import {
  BadRequestError,
} from 'routing-controllers';
import { generateToken } from '../../utils/authorization';
import Admin from '../../entities/admin';
import { getRepository, Repository } from 'typeorm';

const messageGenerator = new StatusMessage('登录');

@Service()
export default class AuthenticationService {
  private adminRepository: Repository<Admin>;

  constructor() {
    this.adminRepository = getRepository(Admin);
  }

  async login(username: string, password: string): Promise<any> {
    const result = await this.adminRepository.findOne({ username, password: md5(password) });

    if (result) {
      const payload = {
        uuid: result.uuid,
        username: result.username,
        name: result.name,
      };
      return {
        token: generateToken(payload),
      };
    } else {
      throw new BadRequestError(messageGenerator.action(false, '用户名或密码错误'));
    }
  }
}
