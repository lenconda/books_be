import {
  JsonController,
  Post,
  BodyParam,
  Authorized,
  Delete,
  Param,
  Get,
} from 'routing-controllers';
import RecordService from './record.service';
import { Inject } from 'typedi';

@JsonController('/record')
export default class RecordController {
  @Inject()
  service: RecordService

  @Post('/all')
  @Authorized()
  async all(
    @BodyParam('query') query: Record<string, any>,
    @BodyParam('page') page: number,
    @BodyParam('size') size: number,
  ) {
    const result = await this.service.query(query, page, size);
    return result;
  }

  @Post('')
  @Authorized()
  async lend(
    @BodyParam('isbn') isbn: string,
    @BodyParam('id_card') idCard: string,
    @BodyParam('return_date') returnDate: string,
  ) {
    const result = await this.service.lend(isbn, idCard, new Date(returnDate));
    return result;
  }

  @Delete('/:uuid')
  @Authorized()
  async return(@Param('uuid') uuid: string) {
    const result = await this.service.return(uuid);
    return result;
  }

  @Get('/:uuid')
  @Authorized()
  async detail(@Param('uuid') uuid: string) {
    const result = await this.service.detail(uuid);
    return result;
  }
}
