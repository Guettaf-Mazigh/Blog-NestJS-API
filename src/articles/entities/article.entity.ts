import { Column } from 'typeorm/browser/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/browser/decorator/columns/PrimaryGeneratedColumn.js';

export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  content!: string;
}
