import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeParent,
  TreeChildren,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Base } from './helpers/Base';
import { Post } from './Post';
import { User } from './User';

@Entity()
@Tree('materialized-path')
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

  @TreeParent()
  public parent!: Comment;

  @TreeChildren()
  public children!: Comment[];
}
