import {CreateGameCommand} from "../../../../application/commands/createGame.command";
import {FakeObject} from "../../domain/fake.object";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {GameController} from "../../../../api/controller/game.controller";
import {CommandBus, ICommand, IQuery, QueryBus} from "@nestjs/cqrs";
import {Exception} from "../../../../core/common/exception/exception";
import {Code} from "../../../../core/common/code/code";
import {EditGameCommand} from "../../../../application/commands/editGame.command";
import {GetGamesQuery} from "../../../../application/queries/getGames.query";

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
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockImplementation(async () => gameResult);
        const result = await gameController.createGame(createGameCommand)
        expect(result.data).toEqual(gameResult);
        expect(result.code).toEqual(200);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should try create game and return an error code', async () => {
        const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.createGame(createGameCommand)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should launch remove/apply discount process', async () => {
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockImplementation(async () => null);
        const result = await gameController.triggerProcess()
        expect(result.code).toEqual(200);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });


    it('Should launch remove/apply discount process and return an error code', async () => {
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.triggerProcess()
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should edit a game and return it', async () => {
        const editGameCommand:EditGameCommand = new EditGameCommand(FakeObject.GAME_OBJECT.slug,FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:FakeObject.GAME_OBJECT.publisher.id,
                name:FakeObject.GAME_OBJECT.publisher.name,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                phone:FakeObject.GAME_OBJECT.publisher.phone,
            },
            tags: editGameCommand.tags,
            releaseDate: DateUtils.toDate(editGameCommand.releaseDate),
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
            releaseDate: editGameCommand.releaseDate,
        } as GetGameResult;
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockImplementation(async () => gameResult);
        const result = await gameController.editGame(editGameCommand.slug,editGameCommand)
        expect(result.data).toEqual(gameResult);
        expect(result.code).toEqual(200);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should try edit game and return an error code', async () => {
        const editGameCommand:EditGameCommand = new EditGameCommand(FakeObject.GAME_OBJECT.slug,FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.editGame(editGameCommand.slug,editGameCommand)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should delete a game ', async () => {
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockImplementation(async () => null);
        const result = await gameController.deleteGame(FakeObject.GAME_OBJECT.slug)
        expect(result.code).toEqual(200);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should try delete game and return an error code', async () => {
        const executeCommandBusSpy = jest.spyOn(commandBus, 'execute')
        executeCommandBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.deleteGame(FakeObject.GAME_OBJECT.slug)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeCommandBusSpy).toBeCalled();
        executeCommandBusSpy.mockReset();
    });

    it('Should find a game and return it', async () => {
        const gameResult = {
            slug: FakeObject.GAME_OBJECT.slug,
            title: FakeObject.GAME_OBJECT.title,
            price: FakeObject.GAME_OBJECT.price,
            publisher: {
                slug:FakeObject.GAME_OBJECT.publisher.slug,
                phone:FakeObject.GAME_OBJECT.publisher.phone,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                name:FakeObject.GAME_OBJECT.publisher.name
            },
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: FakeObject.GAME_OBJECT.releaseDate,
        } as GetGameResult;
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockImplementation(async () => gameResult);
        const result = await gameController.getGame(FakeObject.GAME_OBJECT.slug)
        expect(result.data).toEqual(gameResult);
        expect(result.code).toEqual(200);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });

    it('Should try find game and return an error code', async () => {
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.getGame(FakeObject.GAME_OBJECT.slug)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });

    it('Should find a games and return it', async () => {
        const getGamesQuery:GetGamesQuery= new GetGamesQuery(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.releaseDate,FakeObject.GAME_OBJECT.publisher.name,FakeObject.GAME_OBJECT.publisher.siret,FakeObject.GAME_OBJECT.releaseDate,FakeObject.GAME_OBJECT.releaseDate,{});
        const gameResult = {
            slug: FakeObject.GAME_OBJECT.slug,
            title: FakeObject.GAME_OBJECT.title,
            price: FakeObject.GAME_OBJECT.price,
            publisher: {
                slug:FakeObject.GAME_OBJECT.publisher.slug,
                phone:FakeObject.GAME_OBJECT.publisher.phone,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                name:FakeObject.GAME_OBJECT.publisher.name
            },
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: FakeObject.GAME_OBJECT.releaseDate,
        } as GetGameResult;
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockImplementation(async () => [gameResult]);
        const result = await gameController.getGames(getGamesQuery)
        expect(result.data).toEqual([gameResult]);
        expect(result.code).toEqual(200);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });

    it('Should try find games and return an error code', async () => {
        const getGamesQuery:GetGamesQuery= new GetGamesQuery(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.releaseDate,FakeObject.GAME_OBJECT.publisher.name,FakeObject.GAME_OBJECT.publisher.siret,FakeObject.GAME_OBJECT.releaseDate,FakeObject.GAME_OBJECT.releaseDate,{});
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.getGames(getGamesQuery)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });


    it('Should find a publisher with slug game', async () => {
        const gameResult = {
            slug: FakeObject.GAME_OBJECT.slug,
            title: FakeObject.GAME_OBJECT.title,
            price: FakeObject.GAME_OBJECT.price,
            publisher: {
                slug:FakeObject.GAME_OBJECT.publisher.slug,
                phone:FakeObject.GAME_OBJECT.publisher.phone,
                siret:FakeObject.GAME_OBJECT.publisher.siret,
                name:FakeObject.GAME_OBJECT.publisher.name
            },
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: FakeObject.GAME_OBJECT.releaseDate,
        } as GetGameResult;
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockImplementation(async () => gameResult);
        const result = await gameController.getPublisher(FakeObject.GAME_OBJECT.slug)
        expect(result.data).toEqual(gameResult.publisher);
        expect(result.code).toEqual(200);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });

    it('Should try find publisher data and return an error code', async () => {
        const executeQueryBusSpy = jest.spyOn(queryBus, 'execute')
        executeQueryBusSpy.mockRejectedValue(Exception.new({code: Code.ENTITY_PAYLOAD_VALIDATION_ERROR, data: "this game cannot be updated because a game already exist for the given title and publisher"}));
        const result = await gameController.getPublisher(FakeObject.GAME_OBJECT.slug)
        expect(result.data).toEqual("this game cannot be updated because a game already exist for the given title and publisher");
        expect(result.code).toEqual(Code.ENTITY_PAYLOAD_VALIDATION_ERROR.code);
        expect(executeQueryBusSpy).toBeCalled();
        executeQueryBusSpy.mockReset();
    });




});