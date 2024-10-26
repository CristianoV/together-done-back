import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';

// 4. Shared_Lists
// Tabela para gerenciar listas que são compartilhadas entre usuários.

// shared_list_id (PK)
// list_id (FK para Lists)
// user_id (FK para Users)
// shared_at

@Entity()
export class SharedList {
  @PrimaryGeneratedColumn()
  shared_list_id: number;

  @Column()
  list_id: number;

  @ManyToOne(() => List, (list) => list.items)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  shared_at: Date;
}