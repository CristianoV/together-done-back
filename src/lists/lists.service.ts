import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Item } from './entities/item.entity';
import { List } from './entities/list.entity';
import { SharedList } from './entities/shared_Lists.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(SharedList)
    private sharedListRepository: Repository<SharedList>,
  ) {}

  async create(createListDto: CreateListDto): Promise<List> {
    const newList = this.listRepository.create({
      ...createListDto,
      created_by: createListDto.owner_id,
    });

    const list = await this.listRepository.save(newList);

    const sharedList = this.sharedListRepository.create({
      list,
      user_id: createListDto.owner_id,
      shared_at: new Date(),
    });

    await this.sharedListRepository.save(sharedList);

    return list;
  }

  async findAll(): Promise<List[]> {
    try {
      const list = await this.listRepository
        .createQueryBuilder('list')
        .leftJoinAndSelect('list.items', 'items')
        .leftJoinAndSelect('list.user', 'user')
        .select([
          'list',
          'items',
          'user.id',
          'user.email',
          'user.firstName',
          'user.lastName',
        ])
        .getMany();

      if (!list) {
        throw new NotFoundException('No list found');
      }

      return list;
    } catch (error) {
      throw error;
    }
  }

  async findSharedLists({
    userId,
    page = 1,
    take = 10,
  }: {
    userId: number; // Assumindo que userId é um número
    page?: number;
    take?: number;
  }): Promise<{
    data: SharedList[];
    meta: {
      page: number;
      take: number;
      total: number;
      lastPage: number;
      isLastPage: boolean;
    };
  }> {
    // Validações para os parâmetros de entrada
    if (page < 1) {
      throw new BadRequestException('Page number must be greater than 0');
    }
    if (take < 1) {
      throw new BadRequestException('Take value must be greater than 0');
    }

    try {
      const [sharedLists, count] = await Promise.all([
        this.sharedListRepository
          .createQueryBuilder('shared_list')
          .leftJoinAndSelect('shared_list.list', 'list')
          .leftJoinAndSelect('list.items', 'items')
          .leftJoinAndSelect('list.user', 'user')
          .where('shared_list.user_id = :userId', { userId })
          .skip((page - 1) * take)
          .take(take)
          .getMany(),

        this.sharedListRepository
          .createQueryBuilder('shared_list')
          .where('shared_list.user_id = :userId', { userId })
          .getCount(),
      ]);

      if (!sharedLists.length) {
        return {
          data: [],
          meta: {
            page,
            take,
            total: count,
            lastPage: 0,
            isLastPage: true,
          },
        };
      }

      return {
        data: sharedLists,
        meta: {
          page,
          take,
          total: count,
          lastPage: Math.ceil(count / take),
          isLastPage: page >= Math.ceil(count / take),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<List> {
    const list = await this.listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.items', 'items')
      .leftJoinAndSelect('items.user', 'responsibleUser') // Usando 'user' em vez de 'responsible'
      .leftJoinAndSelect('list.user', 'user')
      .where('list.list_id = :id', { id })
      .getOne();

    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }

    return list;
  }

  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.findOne(id);
    Object.assign(list, updateListDto);
    return await this.listRepository.save(list);
  }

  async remove(id: number): Promise<void> {
    const result = await this.listRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`List with id ${id} not found`);
    }
  }

  async addItem(listId: number, createItemDto: CreateItemDto): Promise<Item> {
    const list = await this.findOne(listId);

    if (!list) {
      throw new NotFoundException(`List with id ${listId} not found`);
    }

    const newItem = this.itemRepository.create({
      ...createItemDto,
      list,
    });

    return await this.itemRepository.save(newItem);
  }

  async removeItem(
    listId: number,
    itemId: number,
  ): Promise<{ message: string }> {
    const result = await this.itemRepository.delete({
      list: { list_id: listId },
      item_id: itemId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Item with id ${itemId} not found in list with id ${listId}`,
      );
    }

    return {
      message: 'Item removed successfully',
    };
  }

  async updateItem(
    listId: number,
    updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { list: { list_id: listId }, item_id: updateItemDto.item_id },
    });
    if (!item) {
      throw new NotFoundException(
        `Item with id ${updateItemDto.item_id} not found in list with id ${updateItemDto.item_id}`,
      );
    }
    Object.assign(item, updateItemDto);
    return await this.itemRepository.save(item);
  }

  async updateItemStatus(listId: number, item_id: number): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: { list: { list_id: listId }, item_id: item_id },
    });

    console.log({
      listId,
      item_id,
      item,
    });
    

    if (!item) {
      throw new NotFoundException(
        `Item with id ${item_id} not found in list with id ${listId}`,
      );
    }
    item.is_completed = !item.is_completed;
    return await this.itemRepository.save(item);
  }

  async shareList(listId: number, userId: number): Promise<SharedList> {
    const list = await this.listRepository.findOne({
      where: { list_id: listId },
    });
    if (!list) {
      throw new NotFoundException(`List with id ${listId} not found`);
    }

    const sharedList = this.sharedListRepository.create({
      list,
      user_id: userId,
      shared_at: new Date(),
    });

    return await this.sharedListRepository.save(sharedList);
  }

  async unshareList(
    listId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const result = await this.sharedListRepository.delete({
      list: { list_id: listId },
      user_id: userId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `List with id ${listId} not shared with user with id ${userId}`,
      );
    }

    return {
      message: 'List unshared successfully',
    };
  }

  async getSharedUsers(listId: number): Promise<SharedList[]> {
    const sharedUsers = await this.sharedListRepository.createQueryBuilder('shared_list')
      .leftJoinAndSelect('shared_list.user', 'user')
      .where('shared_list.list_id = :listId', { listId })
      .select([
        'shared_list.shared_list_id',
        'user.id',
        'user.email',
        'user.firstName',
        'user.lastName',
      ])
      .getMany();

    if (!sharedUsers.length) {
      throw new NotFoundException(
        `List with id ${listId} not shared with any user`,
      );
    }

    return sharedUsers;
  }
}
