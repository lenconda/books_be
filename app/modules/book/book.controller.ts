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
import BookService from './book.service';
import { Inject } from 'typedi';

@JsonController('/book')
export default class BookController {
  @Inject()
  service: BookService

  @Post('/add')
  @Authorized()
  async add(
    @BodyParam('isbn') isbn: string,
    @BodyParam('name') name: string,
    @BodyParam('publish_date') publishDate: string,
    @BodyParam('cover') cover: string,
    @BodyParam('author') author: string,
    @BodyParam('publisher') publisher: string,
  ): Promise<any> {
    const parsedPublishDate = publishDate ? new Date(publishDate) : null;
    const result = await this.service.add(isbn, name, parsedPublishDate, cover, author, publisher);
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

  @Patch('/:isbn')
  @Authorized()
  async edit(@Param('isbn') isbn: string, @Body() updateInfo: Record<string, any>) {
    if (updateInfo.publishDate) {
      updateInfo.publishDate = new Date(updateInfo.publishDate);
    }
    const result = await this.service.edit(isbn, updateInfo);
    return result;
  }

  @Delete('/:isbn')
  @Authorized()
  async delete(@Param('isbn') isbn: string) {
    const result = await this.service.delete(isbn);
    return result;
  }

  @Get('/:isbn')
  @Authorized()
  async detail(@Param('isbn') isbn: string) {
    const result = await this.service.detail(isbn);
    return result;
  }
}
