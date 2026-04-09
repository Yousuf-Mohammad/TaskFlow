import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  actor: User;

  @Column()
  actionType: string;

  @Column()
  targetTaskId: string;

  @Column({ type: 'jsonb', nullable: true })
  dataBefore: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  dataAfter: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;
}
