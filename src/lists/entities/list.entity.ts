import { Item } from 'src/lists/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { SharedList } from './shared_Lists.entity';

// 2. Lists
// Tabela para armazenar diferentes listas criadas pelos usuários, como listas de compras, tarefas, etc.

// list_id (PK)
// user_id (FK para Users)
// list_name
// list_type (ex: "Shopping", "Tasks", "Beach Items")
// created_at
// updated_at

export enum ListType {
  Shopping = 'Shopping',
  Tasks = 'Tasks',
  BeachItems = 'Beach Items',
  Others = 'Others',
}


@Entity()
export class List {
  @PrimaryGeneratedColumn()
  list_id: number;

  @Column()
  list_name: string;

  @Column({
    type: 'enum',
    enum: ListType,
    default: ListType.Others,
  })
  list_type: ListType;

  @Column()
  created_by: number;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Item, (item) => item.list)
  items: Item[]; // Alterar para referência correta

  @OneToMany(() => SharedList, (sharedList) => sharedList.list)
shared_lists: SharedList[];

}
