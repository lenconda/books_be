import {
  JsonController,
  Post,
  BodyParam,
} from 'routing-controllers';
import ReaderService from './reader.service';
import { Inject } from 'typedi';

@JsonController('/reader')
export default class ReaderController {
  @Inject()
  service: ReaderService

  @Post('/add')
  async login(@BodyParam('username') username: string, @BodyParam('password') password: string): Promise<any> {
    const result = await this.service.login(username, password);
    return result;
  }
}
