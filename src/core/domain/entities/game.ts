import {IsArray, IsDate, IsInstance, IsNumber,  IsString} from 'class-validator';
import { v4 } from 'uuid';
import {Publisher} from "./publisher";
import {Entity} from "../../common/entity/Entity";
import {CreateGameEntityType} from "./type/createGame.entity.type";
import {EditGameEntityType} from "./type/editGame.entity.type";
import {DiscountGameEntityType} from "./type/discountGame.entity.type";
import {Exception} from "../../common/exception/Exception";
import {Code} from "../../common/code/Code";
import slugify from "slugify";

export class Game extends Entity<string> {

  @IsString()
  private slug: string;
  
  @IsString()
  private title: string;
  
  @IsNumber()
  private price: number;
  
  @IsInstance(Publisher)
  private publisher: Publisher;

  @IsArray()
  private tags: string[];
  
  @IsDate()
  private releaseDate: Date;
  
  constructor(payload: CreateGameEntityType) {
    super();

    this.id        =  payload.id || v4();
    this.slug        =  slugify(payload.title + " " + payload.publisher.name);
    this.title      = payload.title;
    this.price      = payload.price;
    this.publisher  = new Publisher({
      id:payload.publisher.id,
      name:payload.publisher.name,
      phone:payload.publisher.phone,
      siret:payload.publisher.siret
    });
    this.tags  = payload.tags;
    this.releaseDate  = payload.releaseDate;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getTitle(): string {
    return this.title;
  }
  
  public getPrice(): number {
    return this.price;
  }
  
  public getPublisher(): Publisher {
    return this.publisher;
  }
  
  public getTags(): string[] {
    return this.tags;
  }
  
  public getReleaseDate(): Date {
    return this.releaseDate;
  }
  
  public async edit(payload: EditGameEntityType): Promise<void> {
    if (payload.title) {
      this.title = payload.title;
    }
    if (payload.price) {
      this.price = payload.price;
    }
    if (payload.publisher?.name || payload.title) {
      this.slug = slugify((payload.title ? payload.title: this.title )+ " " + (payload.publisher?.name ? payload.publisher?.name: this.publisher.getName()));
    }
    if (payload.publisher) {
      await this.publisher.edit(payload.publisher);
    }
    if (payload.tags) {
      this.tags = payload.tags;
    }
    if (payload.releaseDate) {
      this.releaseDate = payload.releaseDate;
    }
    await this.validate();
  }

  public async applyDiscount(payload: DiscountGameEntityType): Promise<void> {
    if( payload.percentage > 0 && payload.percentage < 100 ){
      this.price = this.price - (this.price * payload.percentage * 0.01);
    } else {
      throw Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: `${this.constructor.name}: Percentage is not > 0 or < 100.`});
    }
    await this.validate();
  }

  public static async new(payload: CreateGameEntityType): Promise<Game> {
    const game: Game = new Game(payload);
    await game.validate();
    
    return game;
  }

  public toString(): string {
    return " id: " + this.id.toString()
        + " slug: " + this.slug
        + " title: " + this.title
        + " price: " + this.price.toString()
        + " publisher: "+ this.publisher.toString()
        + " tags: "+ this.tags.toString()
        + " releaseDate: "+ this.releaseDate.toString() ;
  }
  
}
