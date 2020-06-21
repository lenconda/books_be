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
  async login(@BodyParam('email') email: string,
              @BodyParam('password') password: string): Promise<any> {
    const result = await this.service.login(email, password);
    return result;
  }
}
