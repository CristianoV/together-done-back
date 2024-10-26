import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

// 5. Notifications
// Se você incluir notificações, esta tabela pode armazenar lembretes e notificações para os usuários.

// notification_id (PK)
// user_id (FK para Users)
// message
// is_read (booleano, para saber se a notificação foi lida)
// created_at
// scheduled_time

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  message: string;

  @Column()
  is_read: boolean;

  @Column()
  created_at: Date;

  @Column()
  scheduled_time: Date;
}
