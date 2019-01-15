import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { Base } from './helpers/Base';
import { Post } from './Post';
import { Comment } from './Comment';

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany((type) => Post, (post) => post.user)
  @JoinColumn({ name: 'post_id' })
  public posts!: Post[];

  @OneToMany((type) => Comment, (comment) => comment.user)
  @JoinColumn({ name: 'comment_id' })
  public comments!: Comment[];
}
