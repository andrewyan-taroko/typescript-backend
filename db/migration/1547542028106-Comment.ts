import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Comment1547542028106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name:    'comment',
      columns: [
        {
          name:               'id',
          type:               'int',
          isPrimary:          true,
          isGenerated:        true,
          generationStrategy: 'increment',
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
        {
          name:       'post_id',
          type:       'int',
          isNullable: false,
        },
      ],
      foreignKeys: [
        new TableForeignKey({
          columnNames:           ['user_id'],
          referencedColumnNames: ['id'],
          referencedTableName:   'user',
        }),
        new TableForeignKey({
          columnNames:           ['post_id'],
          referencedColumnNames: ['id'],
          referencedTableName:   'post',
        }),
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('comment');
  }
}
