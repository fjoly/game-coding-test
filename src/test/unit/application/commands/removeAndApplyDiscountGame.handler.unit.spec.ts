import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {PublisherRepositoryPort} from "../../../../core/domain/port/persistence/publisher.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {FakeObject} from "../../domain/fake.object";
import {RemoveAndApplyDiscountGameHandler} from "../../../../application/commands/removeAndApplyDiscountGame.handler";
import {RemoveAndApplyDiscountGameCommand} from "../../../../application/commands/removeAndApplyDiscountGame.command";

describe('RemoveAndApplyDiscountGameHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let publisherRepositoryPort: PublisherRepositoryPort;
    let removeAndApplyDiscountGameHandler: RemoveAndApplyDiscountGameHandler;
    const removeAndApplyDiscountGameCommand:RemoveAndApplyDiscountGameCommand = new RemoveAndApplyDiscountGameCommand();

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        publisherRepositoryPort = FakeRepository.publisherRepositoryPort
        removeAndApplyDiscountGameHandler = new RemoveAndApplyDiscountGameHandler(gameRepositoryPort);
    });

    it('Should remove 1 game and apply 1 discount', async () => {
        const game2 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const game3 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT3.title,
            price: FakeObject.GAME_OBJECT3.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT3.publisher.name,
                siret:FakeObject.GAME_OBJECT3.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const removeGamesSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        jest.spyOn(gameRepositoryPort, 'findGames')
            .mockImplementationOnce(async () => [game3])
            .mockImplementationOnce(async () => [game2]);
        updateGamesSpy.mockImplementation(async () => game2);
        await removeAndApplyDiscountGameHandler.execute(removeAndApplyDiscountGameCommand)
        expect(updateGamesSpy).toBeCalled();
        expect(removeGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        removeGamesSpy.mockReset();
    });

    it('Should remove 1 game but no apply discount', async () => {
        const game3 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT3.title,
            price: FakeObject.GAME_OBJECT3.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT3.publisher.name,
                siret:FakeObject.GAME_OBJECT3.publisher.siret,
                phone: FakeObject.GAME_OBJECT3.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT3.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT3.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const removeGamesSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        jest.spyOn(gameRepositoryPort, 'findGames')
            .mockImplementationOnce(async () => [game3])
            .mockImplementationOnce(async () => undefined);
        await removeAndApplyDiscountGameHandler.execute(removeAndApplyDiscountGameCommand)
        expect(updateGamesSpy).not.toBeCalled();
        expect(removeGamesSpy).toBeCalled();
        updateGamesSpy.mockReset();
        removeGamesSpy.mockReset();
    });


    it('Should apply 1 discount but not remove game', async () => {
        const game2 = await Game.new({
            id:null,
            title: FakeObject.GAME_OBJECT2.title,
            price: FakeObject.GAME_OBJECT2.price,
            publisher: {
                id:null,
                name:FakeObject.GAME_OBJECT2.publisher.name,
                siret:FakeObject.GAME_OBJECT2.publisher.siret,
                phone: FakeObject.GAME_OBJECT2.publisher.phone,
            },
            tags: FakeObject.GAME_OBJECT2.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT2.releaseDate),
        });
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const removeGamesSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        jest.spyOn(gameRepositoryPort, 'findGames')
            .mockImplementationOnce(async () => undefined)
            .mockImplementationOnce(async () => [game2]);
        updateGamesSpy.mockImplementation(async () => game2);
        await removeAndApplyDiscountGameHandler.execute(removeAndApplyDiscountGameCommand)
        expect(updateGamesSpy).toBeCalled();
        expect(removeGamesSpy).not.toBeCalled();
        updateGamesSpy.mockReset();
        removeGamesSpy.mockReset();
    });

    it('Should not apply discount nor remove game', async () => {
        const updateGamesSpy = jest.spyOn(gameRepositoryPort, 'updateGames')
        const removeGamesSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        jest.spyOn(gameRepositoryPort, 'findGames')
            .mockImplementationOnce(async () => undefined)
            .mockImplementationOnce(async () => undefined);
        await removeAndApplyDiscountGameHandler.execute(removeAndApplyDiscountGameCommand)
        expect(updateGamesSpy).not.toBeCalled();
        expect(removeGamesSpy).not.toBeCalled();
        updateGamesSpy.mockReset();
        removeGamesSpy.mockReset();
    });


});