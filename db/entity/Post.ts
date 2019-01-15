import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Base } from './helpers/Base';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Post extends Base{
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public title!: string;

  @Column()
  public content!: string;

  @ManyToOne((type) => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  @JoinColumn({ name: 'comment_id' })
  public comments!: Comment[];
}
