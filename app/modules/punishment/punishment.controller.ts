import {
  JsonController,
  Post,
  BodyParam,
  Authorized,
} from 'routing-controllers';
import PunishmentService from './punishment.service';
import { Inject } from 'typedi';

@JsonController('/punishment')
export default class PunishmentController {
  @Inject()
  service: PunishmentService

  @Post('')
  @Authorized()
  async punishment(
    @BodyParam('uuid') uuid: string,
    @BodyParam('amount') amount: number,
  ) {
    const result = await this.service.pay(uuid, amount);
    return result;
  }
}
