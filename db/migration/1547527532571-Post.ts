import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Post1547527532571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name:    'post',
      columns: [
        {
          name:               'id',
          type:               'int',
          isPrimary:          true,
          isGenerated:        true,
          generationStrategy: 'increment',
        },
        {
          name:       'title',
          type:       'varchar',
          isNullable: false,
        },
        {
          name:       'content',
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
        {
          name:       'user_id',
          type:       'int',
          isNullable: false,
        },
      ],
      foreignKeys: [
        new TableForeignKey({
          columnNames:           ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName:   'user',
        })
      ]
    }));
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('post');
  }
}
