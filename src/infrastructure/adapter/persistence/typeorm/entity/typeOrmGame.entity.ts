import {Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import {TypeOrmPublisherEntity} from "./typeOrmPublisher.entity";

@Entity('game')
export class TypeOrmGameEntity {
  
  @PrimaryColumn()
  public id: string;

  @Column()
  public title: string;

  @Column()
  public price: number;

  @OneToOne(() => TypeOrmPublisherEntity, {eager:true, cascade:true })
  @JoinColumn()
  public publisher: TypeOrmPublisherEntity;

  @Column("text",{ array: true })
  public tags: string[];

  @Column()
  public releaseDate: Date;
  
}
