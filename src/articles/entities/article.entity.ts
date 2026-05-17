import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  content!: string;

  @Column()
  authorId!: number;

  @ManyToOne(() => User, (user) => user.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author!: User;
}
