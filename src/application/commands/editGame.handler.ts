import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../core/domain/entities/game";
import {EditGameCommand} from "./editGame.command";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";
import {PublisherRepositoryPort} from "../../core/domain/port/persistence/publisher.repository.port";
import {DateUtils} from "../../core/common/utils/date/date.utils";
import {GetGameResult} from "../queries/getGame.result";
import {GameMapper} from "../mapper/game.mapper";
import slugify from "slugify";

@CommandHandler(EditGameCommand)
export class EditGameHandler implements ICommandHandler<EditGameCommand>{
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
      @Inject(GameProvider.PublisherRepository)
      private readonly publisherRepository: PublisherRepositoryPort,
  ) {}
  
  public async execute(command: EditGameCommand): Promise<GetGameResult> {

    if(!command.slug){
      throw Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because slug reference of game is empty "});
    }
    console.log(command.slug);
    const game: Game = await this.gameRepository.findGame({slug:command.slug})

    if(game === undefined){
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, data: "this game cannot be updated because it does not exist : " + command.slug});
    }

    //Verify if the new slug already exist in case of updating the slug
    if(command.title || command.publisher?.name){
      const gameWithNewSlug: Game = await this.gameRepository.findGame({slug:slugify((command.title ? command.title: game.getTitle() )+ " " + (command.publisher?.name ? command.publisher?.name: game.getPublisher().getName()))})
      //If slug exist and it's different from game to be Update -> Throw that game cannot be updated.
      if(gameWithNewSlug!== undefined && gameWithNewSlug.getId() !== game.getId()){
        throw Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"});
      }
    }

    //If publisher data wanted to be modified.
    if(command.publisher){
      let publisher: Publisher;
      //If the slug of publisher will be modified, verify if existing publisher with the new slug it already exist
      if(command.publisher?.name || command.publisher?.siret) {
        publisher = await this.publisherRepository.findPublisher({slug:slugify((command.publisher?.name ? command.publisher?.name: game.getPublisher().getName() )+ " " + (command.publisher?.siret ? command.publisher?.siret: game.getPublisher().getSiret()))})
      }
      //If publisher already exist
      if(publisher!== undefined) {
        //Case of edit with a publisher already known
        await game.edit({
          title: command.title,
          publisher: {
            id:publisher.getId(),
            name:command.publisher?.name,
            siret:command.publisher?.siret,
            phone:command.publisher?.phone,
          },
          ...(command.releaseDate !== undefined && {releaseDate: DateUtils.toDate(command.releaseDate)}),
          tags: command.tags,
          price: command.price
        });
      } else {
        //If new publisher modified but his not known create new one.
        await game.edit({
          title:command.title,
          publisher: {id:null,name:command.publisher?.name,siret:command.publisher?.siret,phone:command.publisher?.phone},
          ...(command.releaseDate !== undefined && {releaseDate: DateUtils.toDate(command.releaseDate)}),
          tags: command.tags,
          price: command.price
        });
      }
    } else {
      //If publisher not modified
      await game.edit({
        title:command.title,
        publisher: null,
        ...(command.releaseDate !== undefined && {releaseDate: DateUtils.toDate(command.releaseDate)}),
        tags: command.tags,
        price: command.price
      });
    }
    console.log("Game edited : " + game.toString());

    const games = await this.gameRepository.updateGames(game);

    if(Array.isArray(games)){
      //Should never happen
      throw Exception.new({code: Code.INTERNAL_ERROR, data: "Error while returning data"});
    }

    return GameMapper.toGameResult(games);
  }
  
}
