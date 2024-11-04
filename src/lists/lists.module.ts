import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Item } from './entities/item.entity';
import { SharedList } from './entities/shared_Lists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([List, Item, SharedList])],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
