import { Column, Entity, PrimaryColumn } from 'typeorm';
import {Publisher} from "../../../../../core/domain/entities/publisher";
import {IsNumber, IsString} from "class-validator";

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
