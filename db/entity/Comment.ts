import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Base } from './helpers/Base';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Comment extends Base {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public content!: string;

  @ManyToOne((type) => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  public post!: Post;
}
