import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('publisher')
export class TypeOrmPublisherEntity {
  
  @PrimaryColumn()
  public id: string;

  @Column({ unique: true })
  public slug: string;

  @Column()
  public name: string;

  @Column()
  public siret: number;

  @Column()
  public phone: string;
  
}
