import {IsNumber, IsString, IsUUID} from 'class-validator';
import { v4 } from 'uuid';
import {CreatePublisherEntityType} from "./type/createPublisher.entity.type";
import {Entity} from "../../common/entity/Entity";
import {EditGameEntityType} from "./type/editGame.entity.type";
import {EditPublisherEntityType} from "./type/editPublisher.entity.type";

export class Publisher extends Entity<string> {
  
  @IsString()
  private name: string;
  
  @IsNumber()
  private siret: number;

  @IsString()
  private phone: string;
  
  constructor(payload: CreatePublisherEntityType) {
    super();
    this.id   = payload.id || v4();
    this.name      = payload.name;
    this.siret      = payload.siret;
    this.phone  = payload.phone;
  }

  public async edit(payload: EditPublisherEntityType): Promise<void> {
    if (payload.id) {
      this.id = payload.id;
    }
    if (payload.name) {
      this.name = payload.name;
    }
    if (payload.phone) {
      this.phone = payload.phone;
    }
    if (payload.siret) {
      this.siret = payload.siret;
    }
    await this.validate();
  }

  public getName(): string {
    return this.name;
  }

  public getSiret(): number {
    return this.siret;
  }

  public getPhone(): string {
    return this.phone;
  }

  public static async new(payload: CreatePublisherEntityType): Promise<Publisher> {
    const publisher: Publisher = new Publisher(payload);
    await publisher.validate();
    
    return publisher;
  }

  public toString(): string {
    return "id: " + this.id.toString() + " name: " + this.name + " siret: " + this.siret.toString() + " phone : "+ this.phone;
  }
  
}
