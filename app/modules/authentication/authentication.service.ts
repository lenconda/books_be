import { Service } from 'typedi';
import md5 from 'md5';
import { StatusMessage } from '../../utils/messages';
import {
  ForbiddenError,
} from 'routing-controllers';
import { generateToken } from '../../utils/authorization';

const messageGenerator = new StatusMessage('登录');

@Service()
export default class AuthenticationService {
  async login(username: string, password: string): Promise<any> {
    const result = null;
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
      throw new ForbiddenError(messageGenerator.action(false, '用户名或密码错误'));
    }
  }
}
