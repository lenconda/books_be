import {
  JsonController,
  Post,
  BodyParam,
  Authorized,
  Patch,
  Delete,
  Param,
  Body,
  Get,
} from 'routing-controllers';
import ReaderService from './reader.service';
import { Inject } from 'typedi';

@JsonController('/reader')
export default class ReaderController {
  @Inject()
  service: ReaderService

  @Post('/add')
  @Authorized()
  async add(
    @BodyParam('id_card') idCard: string,
    @BodyParam('name') name: string,
    @BodyParam('gender') gender: number,
    @BodyParam('address') address: string,
    @BodyParam('phone') phone: string,
  ): Promise<any> {
    const result = await this.service.add(idCard, name, gender, address, phone);
    return result;
  }

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

  @Post('/search')
  @Authorized()
  async search(
    @BodyParam('keyword') keyword: string,
  ) {
    const result = await this.service.search(keyword);
    return result;
  }

  @Patch('/:id_card')
  @Authorized()
  async edit(@Param('id_card') idCard: string, @Body() updateInfo: Record<string, any>) {
    const result = await this.service.edit(idCard, updateInfo);
    return result;
  }

  @Delete('/:id_card')
  @Authorized()
  async delete(@Param('id_card') idCard: string) {
    const result = await this.service.delete(idCard);
    return result;
  }

  @Get('/:id_card')
  @Authorized()
  async detail(@Param('id_card') idCard: string) {
    const result = await this.service.detail(idCard);
    return result;
  }
}
