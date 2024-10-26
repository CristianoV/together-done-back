import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';

// 3. Items
// Armazena os itens dentro de cada lista.

// item_id (PK)
// list_id (FK para Lists)
// item_name
// is_completed (booleano, para indicar se a tarefa foi concluída)
// user_id (FK para Users)
// created_at
// updated_at

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @Column()
  list_id: number;

  @ManyToOne(() => List, (list) => list.items)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Column()
  item_name: string;

  @Column()
  is_completed: boolean;

  @Column()
  responsible_id: number;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'responsible_id' })
  user: User;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}