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
          name:               'id',
          type:               'int',
          isPrimary:          true,
          isGenerated:        true,
          generationStrategy: 'increment',
        },
        {
          name:       'email',
          type:       'varchar',
          isNullable: false,
          isUnique:   true,
        },
        {
          name:       'password',
          type:       'varchar',
          isNullable: false,
        },
        {
          name:       'created_at',
          type:       'timestamp',
          isNullable: false,
          default:    'LOCALTIMESTAMP',
        },
        {
          name:       'updated_at',
          type:       'timestamp',
          isNullable: false,
          default:    'LOCALTIMESTAMP'
        },
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('user');
  }
}
