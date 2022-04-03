import {GameRepositoryPort} from "../../core/domain/port/persistence/game.repository.port";
import {CreateGameCommand} from "./createGame.command";
import {Game} from "../../core/domain/entities/game";
import {Exception} from "../../core/common/exception/Exception";
import {Code} from "../../core/common/code/Code";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {Publisher} from "../../core/domain/entities/publisher";
import {Inject} from "@nestjs/common";
import {GameProvider} from "../../core/domain/provider/game.provider";
import {PublisherRepositoryPort} from "../../core/domain/port/persistence/publisher.repository.port";
import {DateUtils} from "../../core/common/utils/date/date.utils";

@CommandHandler(CreateGameCommand)
export class CreateGameHandler implements ICommandHandler<CreateGameCommand> {
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
      @Inject(GameProvider.PublisherRepository)
      private readonly publisherRepository: PublisherRepositoryPort,
  ) {}
  
  async execute(command: CreateGameCommand): Promise<void> {

    const gameAlreadyExist: Game = await this.gameRepository.findGame({title:command.title})

    if( gameAlreadyExist !== undefined ){
      throw Exception.new({code: Code.ENTITY_ALREADY_EXISTS_ERROR,data: "this game cannot be created because it already exist : " + command.title});
    }

    const publisher: Publisher = await this.publisherRepository.findPublisher({name:command.publisher.name,siret:command.publisher.siret})

    let game: Game;

    if(publisher!== undefined){
      //Case of Publisher couple name/siret already exist in database
      game = await Game.new({
        id:null,
        title: command.title,
        price: command.price,
        publisher: {
          id: publisher.getId(),
          name:publisher.getName(),
          siret:publisher.getSiret(),
          phone:publisher.getPhone()
        },
        tags: command.tags,
        releaseDate: DateUtils.toDate(command.releaseDate),
      });
    } else {
      //Case of new Publisher
      game = await Game.new({
        id:null,
        title: command.title,
        price: command.price,
        publisher: command.publisher,
        tags: command.tags,
        releaseDate: DateUtils.toDate(command.releaseDate),
      });
    }


    
    await this.gameRepository.addGame(game);
    console.log("Game created : " + game.toString());
  }
  
}
