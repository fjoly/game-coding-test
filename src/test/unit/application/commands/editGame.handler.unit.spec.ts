import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {GetGameResult} from "../../../../application/queries/getGame.result";
import {FakeObject} from "../../domain/fake.object";
import {EditGameCommand} from "../../../../application/commands/editGame.command";
import {EditGameHandler} from "../../../../application/commands/editGame.handler";

describe('EditGameHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let publisherRepositoryPort: PublisherRepositoryPort;
    let editGameHandler: EditGameHandler;
    const editGameCommand:EditGameCommand = new EditGameCommand(
        FakeObject.GAME_OBJECT.slug,
        FakeObject.GAME_OBJECT.title,
        FakeObject.GAME_OBJECT.price,
        FakeObject.GAME_OBJECT.publisher,
        FakeObject.GAME_OBJECT.tags,
        FakeObject.GAME_OBJECT.releaseDate);

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        publisherRepositoryPort = FakeRepository.publisherRepositoryPort
        editGameHandler = new EditGameHandler(gameRepositoryPort,publisherRepositoryPort);
    });

    it('Should edit a game and return it', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
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
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const findPublisherSpy = jest.spyOn(publisherRepositoryPort, 'findPublisher');
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        findPublisherSpy.mockImplementation(() => undefined);
        updateGamesSpy.mockImplementation(async () => game);
        expect(await editGameHandler.execute(editGameCommand)).toEqual(gameResult);
        expect(updateGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        findPublisherSpy.mockReset();
    });

    it('Should edit a game with another existing publisher and return it', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
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
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const findPublisherSpy = jest.spyOn(publisherRepositoryPort, 'findPublisher');
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        findPublisherSpy.mockImplementation(async () => game.getPublisher());
        updateGamesSpy.mockImplementation(async () => game);
        expect(await editGameHandler.execute(editGameCommand)).toEqual(gameResult);
        expect(updateGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        findPublisherSpy.mockReset();
    });

    it('Should edit a game without touching publisher data', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
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
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames');
        const findPublisherSpy = jest.spyOn(publisherRepositoryPort, 'findPublisher');
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        findPublisherSpy.mockImplementation(async () => game.getPublisher());
        updateGamesSpy.mockImplementation(async () => game);
        expect(await editGameHandler.execute({
            slug:editGameCommand.slug,
            publisher: undefined,
            price: editGameCommand.price,
            tags:editGameCommand.tags,
            releaseDate:editGameCommand.releaseDate,
            title:editGameCommand.title,
        })).toEqual(gameResult);
        expect(findPublisherSpy).not.toBeCalled();
        expect(updateGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        findPublisherSpy.mockReset();
    });

    it('Should not edit a game because slug not provided and throw an error', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
            },
            tags: editGameCommand.tags,
            releaseDate: DateUtils.toDate(editGameCommand.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames');
        updateGamesSpy.mockImplementation(async () => game);
        await expect(async () => {
            await editGameHandler.execute({
                slug:undefined,
                publisher: undefined,
                price: editGameCommand.price,
                tags:editGameCommand.tags,
                releaseDate:editGameCommand.releaseDate,
                title:editGameCommand.title,
            });
        }).rejects.toThrow();
        expect(updateGamesSpy).not.toBeCalled();
        updateGamesSpy.mockReset();
    });

    it('Should not edit a game because game with this slug not exist and throw an error', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
            },
            tags: editGameCommand.tags,
            releaseDate: DateUtils.toDate(editGameCommand.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames');
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => undefined);
        updateGamesSpy.mockImplementation(async () => game);
        await expect(async () => {
            await editGameHandler.execute(editGameCommand);
        }).rejects.toThrow();
        expect(updateGamesSpy).not.toBeCalled();
        updateGamesSpy.mockReset();
    });

    it('Should not edit a game because game with already exist with the new slug', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
            },
            tags: editGameCommand.tags,
            releaseDate: DateUtils.toDate(editGameCommand.releaseDate),
        });
        const game2 = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
            },
            tags: editGameCommand.tags,
            releaseDate: DateUtils.toDate(editGameCommand.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames');
        jest.spyOn(gameRepositoryPort, 'findGame')
            .mockImplementationOnce(async () => game)
            .mockImplementationOnce(async () => game2);
        updateGamesSpy.mockImplementation(async () => game);
        await expect(async () => {
            await editGameHandler.execute(editGameCommand);
        }).rejects.toThrow();
        expect(updateGamesSpy).not.toBeCalled();
        updateGamesSpy.mockReset();
    });

    it('Should edit a game but throw error because returning list of games', async () => {
        const game = await Game.new({
            id:null,
            title: editGameCommand.title,
            price: editGameCommand.price,
            publisher: {
                id:null,
                name:editGameCommand.publisher.name,
                siret:editGameCommand.publisher.siret,
                phone: editGameCommand.publisher.phone,
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
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const findPublisherSpy = jest.spyOn(publisherRepositoryPort, 'findPublisher');
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        findPublisherSpy.mockImplementation(() => undefined);
        updateGamesSpy.mockImplementation(async () => [game]);
        await expect(async () => {
            await editGameHandler.execute(editGameCommand);
        }).rejects.toThrow();
        expect(updateGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        findPublisherSpy.mockReset();
    });
});