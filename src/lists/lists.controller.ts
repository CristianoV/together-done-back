import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SharedList } from './entities/shared_Lists.entity';
import { ShareNewList } from './dto/share-list.dto';

@ApiTags('lists')
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listsService.create(createListDto);
  }

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Get('shared/:userId')
  findSharedLists(
    @Param('userId') userId: string,
    @Query() query: { page?: number; limit?: number },
  ) {
    console.log(query);

    return this.listsService.findSharedLists({
      ...query,
      userId: +userId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(+id, updateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(+id);
  }

  @Post(':listId/items')
  addItem(
    @Param('listId') listId: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.listsService.addItem(+listId, createItemDto);
  }

  @Delete(':list_Id/items')
  removeItem(
    @Param('list_Id') list_Id: string,
    @Body('item_id') item_id: { item_id: number },
  ) {
    return this.listsService.removeItem(+list_Id, +item_id);
  }

  @Patch(':list_Id/item')
  updateItem(
    @Param('list_Id') list_Id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.listsService.updateItem(+list_Id, updateItemDto);
  }

  @Patch(':list_Id/item/status')
  updateItemStatus(
    @Param('list_Id') list_Id: string,
    @Body('item_id') item_id: { item_id: number},
  ) {
    return this.listsService.updateItemStatus(+list_Id, +item_id);
  }

  @Post(':list_Id/share')
  shareList(@Param('list_Id') list_Id: string, @Body() body: ShareNewList) {
    return this.listsService.shareList(+list_Id, body.userId);
  }

  @Delete(':list_Id/share')
  unshareList(@Param('list_Id') list_Id: string, @Body() body: { userId: number }) {
    return this.listsService.unshareList(+list_Id, body.userId);
  }

  @Get(':list_Id/share')
  getSharedUsers(@Param('list_Id') list_Id: string) {
    return this.listsService.getSharedUsers(+list_Id);
  }
}
