import {
  MigrationInterface,
  QueryRunner,
  Table,
} from 'typeorm';

export class User1546849364208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name:    'user',
      columns: [
        {
          name:      'id',
          type:      'int',
          isPrimary: true,
        },
        {
          name: 'email',
          type: 'varchar',
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('user');
  }
}
