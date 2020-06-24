import {
  JsonController,
  Authorized,
  Get,
  QueryParam,
} from 'routing-controllers';
import DashboardService from './dashboard.service';
import { Inject } from 'typedi';

@JsonController('/dashboard')
export default class DashboardController {
  @Inject()
  service: DashboardService

  @Get('/count')
  @Authorized()
  async count(
    @QueryParam('start') start = Date.now().toString(),
    @QueryParam('end') end = Date.now().toString(),
  ) {
    const result = await this.service.count(new Date(start), new Date(end));
    return result;
  }
}
