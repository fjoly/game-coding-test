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

@CommandHandler(EditGameCommand)
export class EditGameHandler implements ICommandHandler<EditGameCommand>{
  
  constructor(
      @Inject(GameProvider.GameRepository)
      private readonly gameRepository: GameRepositoryPort,
      @Inject(GameProvider.PublisherRepository)
      private readonly publisherRepository: PublisherRepositoryPort,
  ) {}
  
  public async execute(command: EditGameCommand): Promise<void> {
    
    const game: Game = await this.gameRepository.findGame({title:command.title})
    if(game === undefined){
      throw Exception.new({code: Code.ENTITY_NOT_FOUND_ERROR, data: "this game cannot be updated because it does not exist : " + command.title});
    }
    const publisher: Publisher = await this.publisherRepository.findPublisher({name:command.publisher.name,siret:command.publisher.siret})

    if(publisher!== undefined) {
      //Case of edit with a publisher already known,if couple Name/Siret known only phone can be edited
      await game.edit({
        publisher: {
          id:publisher.getId(),
          name:publisher.getName(),
          siret:publisher.getSiret(),
          phone:command.publisher.phone,
        },
        ...(command.releaseDate !== undefined && {releaseDate: DateUtils.toDate(command.releaseDate)}),
        tags: command.tags,
        price: command.price
      });
    } else {
      //Other
      await game.edit({
        publisher: command.publisher,
        ...(command.releaseDate !== undefined && {releaseDate: DateUtils.toDate(command.releaseDate)}),
        tags: command.tags,
        price: command.price
      });
    }
    
    await this.gameRepository.updateGames(game);
    console.log("Game edited : " + game.toString());
  }
  
}
