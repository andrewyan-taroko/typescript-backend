import {
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export abstract class Base {
  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt!: Date;
}
