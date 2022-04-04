import {IsNumber, IsString, IsUUID} from 'class-validator';
import { v4 } from 'uuid';
import {CreatePublisherEntityType} from "./type/createPublisher.entity.type";
import {Entity} from "../../common/entity/Entity";
import {EditGameEntityType} from "./type/editGame.entity.type";
import {EditPublisherEntityType} from "./type/editPublisher.entity.type";
import slugify from "slugify";

export class Publisher extends Entity<string> {

  @IsString()
  private slug: string;

  @IsString()
  private name: string;
  
  @IsNumber()
  private siret: number;

  @IsString()
  private phone: string;
  
  constructor(payload: CreatePublisherEntityType) {
    super();
    this.id   = payload.id || v4();
    this.slug = slugify(payload.name + " " + payload.siret);
    this.name = payload.name;
    this.siret = payload.siret;
    this.phone = payload.phone;
  }

  public async edit(payload: EditPublisherEntityType): Promise<void> {
    if (payload.id) {
      this.id = payload.id;
    }
    if (payload.name || payload.siret) {
      this.slug = slugify((payload.name ? payload.name: this.name )+ " " + (payload.siret ? payload.siret: this.siret));
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

  public getSlug(): string {
    return this.slug;
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
    return "id: " + this.id.toString() + " slug: " + this.slug + " name: " + this.name + " siret: " + this.siret.toString() + " phone : "+ this.phone;
  }
  
}
