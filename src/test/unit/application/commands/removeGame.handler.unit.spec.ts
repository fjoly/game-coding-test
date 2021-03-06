import {GameRepositoryPort} from "../../../../core/domain/port/persistence/game.repository.port";
import {Game} from "../../../../core/domain/entities/game";
import {DateUtils} from "../../../../core/common/utils/date/date.utils";
import {FakeRepository} from "../../infrastructure/fake/fake.repository";
import {RemoveGameHandler} from "../../../../application/commands/removeGame.handler";
import {RemoveGameCommand} from "../../../../application/commands/removeGame.command";
import {FakeObject} from "../../domain/fake.object";

describe('RemoveGameHandler', () => {
    let gameRepositoryPort: GameRepositoryPort;
    let removeGameHandler: RemoveGameHandler;
    const removeGameCommand:RemoveGameCommand = new RemoveGameCommand(FakeObject.GAME_OBJECT.slug);

    beforeEach(async () => {
        gameRepositoryPort = FakeRepository.gameRepositoryPort
        removeGameHandler = new RemoveGameHandler(gameRepositoryPort);
    });

    it('Should remove a game', async () => {
        const game = await Game.new({
            id:FakeObject.GAME_OBJECT.id,
            title: FakeObject.GAME_OBJECT.title,
            price: FakeObject.GAME_OBJECT.price,
            publisher: FakeObject.GAME_OBJECT.publisher,
            tags: FakeObject.GAME_OBJECT.tags,
            releaseDate: DateUtils.toDate(FakeObject.GAME_OBJECT.releaseDate),
        });
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => game);
        const removeSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        await removeGameHandler.execute(removeGameCommand)
        expect(removeSpy).toBeCalled();
        removeSpy.mockReset()
    });

    it('Should not remove a game because not exist', async () => {
        jest.spyOn(gameRepositoryPort, 'findGame').mockImplementation(async () => undefined);
        const removeSpy = jest.spyOn(gameRepositoryPort, 'removeGames');
        await expect(async () => {
            await removeGameHandler.execute(removeGameCommand);
        }).rejects.toThrow();
        expect(removeSpy).not.toBeCalled();
        removeSpy.mockReset()
    });

});