import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn} from 'typeorm';
import {TypeOrmPublisherEntity} from "./typeOrmPublisher.entity";

@Entity('game')
export class TypeOrmGameEntity {
  
  @PrimaryColumn()
  public id: string;

  @Column({ unique: true })
  public slug: string;

  @Column()
  public title: string;

  @Column("decimal", { precision: 8, scale: 2 })
  public price: number;

  @ManyToOne(() => TypeOrmPublisherEntity, {eager:true, cascade:true })
  @JoinColumn()
  public publisher: TypeOrmPublisherEntity;

  @Column("text",{ array: true })
  public tags: string[];

  @Column()
  public releaseDate: Date;
  
}
