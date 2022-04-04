import {CreateGameHandler} from "../../../../application/commands/createGame.handler";
import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import { v4 } from 'uuid';
import {CreateGameCommand} from "../../../../application/commands/createGame.command";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {FakeObject} from "../../domain/fake.object";

describe('CreateGameHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let publisherRepositoryPort: PublisherRepositoryPort;
    let createGameHandler: CreateGameHandler;
    const createGameCommand:CreateGameCommand = new CreateGameCommand(FakeObject.GAME_OBJECT.title,FakeObject.GAME_OBJECT.price,FakeObject.GAME_OBJECT.publisher,FakeObject.GAME_OBJECT.tags,FakeObject.GAME_OBJECT.releaseDate);

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        publisherRepositoryPort = FakeRepository.publisherRepositoryPort
        createGameHandler = new CreateGameHandler(gameRepositoryPort,publisherRepositoryPort);
    });

    it('Should create a game and return it', async () => {
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
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(() => undefined);
        jest.spyOn(publisherRepositoryPort, 'findPublisher').mockImplementation(() => undefined);
        jest.spyOn(gameRepositoryPort, 'addGame').mockImplementation(async () => game);
        expect(await createGameHandler.execute(createGameCommand)).toEqual(gameResult);
    });

    it('Should create a game and return it with a publisher already known', async () => {
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
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(() => undefined);
        jest.spyOn(publisherRepositoryPort, 'findPublisher').mockImplementation(async () => game.getPublisher());
        jest.spyOn(gameRepositoryPort, 'addGame').mockImplementation(async () => game);
        expect(await createGameHandler.execute(createGameCommand)).toEqual(gameResult);
    });

    it('Should not create a game and throw an error', async () => {
        const game = await Game.new({
            id:null,
            title: createGameCommand.title,
            price: createGameCommand.price,
            publisher: createGameCommand.publisher,
            tags: createGameCommand.tags,
            releaseDate: DateUtils.toDate(createGameCommand.releaseDate),
        });
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        await expect(async () => {
            await createGameHandler.execute(createGameCommand);
        }).rejects.toThrow();
    });
});