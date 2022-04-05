import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {CreateGameHandler} from "../../../../application/commands/createGame.handler";
import {CreateGameCommand} from "../../../../application/commands/createGame.command";
import {FakeObject} from "../../domain/fake.object";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {GameController} from "../../../../api/controller/game.controller";
import {CommandBus, ICommand, IQuery, QueryBus} from "@nestjs/cqrs";
import {Exception} from "../../../../core/common/exception/Exception";
import {Code} from "../../../../core/common/code/Code";

describe('GameController', () => {
    let gameController: GameController;
    let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        commandBus = new CommandBus<ICommand>(null);
        queryBus = new QueryBus<IQuery>(null);
        gameController = new GameController(commandBus,queryBus);
    });

    it('Should create a game and return it', async () => {
        const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
        const game = await Game.new({
            id:null,
            title: createGameCommand.title,
            price: createGameCommand.price,
            publisher: createGameCommand.publisher,
            tags: createGameCommand.tags,
            releaseDate: DateUtils.toDate(createGameCommand.releaseDate),
        });
        const gameResult = {
            slug: game.getSlug(),
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: {
                slug:game.getPublisher().getSlug(),
                phone:game.getPublisher().getPhone(),
                siret:game.getPublisher().getSiret(),
                name:game.getPublisher().getName()
            },
            tags: game.getTags(),
            releaseDate: createGameCommand.releaseDate,
        } as GetGameResult;
        const addCommandBusSpy = jest.spyOn(commandBus, 'execute')
        addCommandBusSpy.mockImplementation(async () => gameResult);
        const result = await gameController.createGame(createGameCommand)
        expect(result.data).toEqual(gameResult);
        expect(result.code).toEqual(200);
        expect(addCommandBusSpy).toBeCalled();
        addCommandBusSpy.mockReset();
    });

    it('Should return an erro code', async () => {
        const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
        const game = await Game.new({
            id:null,
            title: createGameCommand.title,
            price: createGameCommand.price,
            publisher: createGameCommand.publisher,
            tags: createGameCommand.tags,
            releaseDate: DateUtils.toDate(createGameCommand.releaseDate),
        });
        const gameResult = {
            slug: game.getSlug(),
            title: game.getTitle(),
            price: game.getPrice(),
            publisher: {
                slug:game.getPublisher().getSlug(),
                phone:game.getPublisher().getPhone(),
                siret:game.getPublisher().getSiret(),
                name:game.getPublisher().getName()
            },
            tags: game.getTags(),
            releaseDate: createGameCommand.releaseDate,
        } as GetGameResult;
        const addCommandBusSpy = jest.spyOn(commandBus, 'execute')
        addCommandBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.createGame(createGameCommand)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(addCommandBusSpy).toBeCalled();
        addCommandBusSpy.mockReset();
    });

});