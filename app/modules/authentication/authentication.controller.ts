import {
  JsonController,
  Post,
  BodyParam,
  Authorized,
  Get,
  CurrentUser,
} from 'routing-controllers';
import AuthenticationService from './authentication.service';
import { Inject } from 'typedi';

@JsonController('/auth')
export default class AuthenticationController {
  @Inject()
  service: AuthenticationService

  @Post('/login')
  async login(@BodyParam('username') username: string, @BodyParam('password') password: string): Promise<any> {
    const result = await this.service.login(username, password);
    return result;
  }

  @Authorized()
  @Get('/check')
  async check() {
    return '';
  }

  @Authorized()
  @Get('/info')
  async info(@CurrentUser() currentUser) {
    return currentUser;
  }
}
