import { Item } from 'src/lists/entities/item.entity';
import { SharedList } from 'src/lists/entities/shared_Lists.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

// 1. Users
// Essa tabela armazenará informações sobre os usuários do aplicativo.

// user_id (PK)
// username
// email
// password_hash
// created_at
// updated_at

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => SharedList, (sharedList) => sharedList.user)
shared_lists: SharedList[];

}
