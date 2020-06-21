import {
  JsonController,
  Post,
  BodyParam,
} from 'routing-controllers';
import AuthenticationService from './authentication.service';
import { Inject } from 'typedi';

@JsonController('/auth')
export default class HelloController {
  @Inject()
  service: AuthenticationService

  @Post('/login')
  async login(@BodyParam('username') username: string, @BodyParam('password') password: string): Promise<any> {
    const result = await this.service.login(username, password);
    return result;
  }
}
