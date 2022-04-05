import {DataSource} from 'typeorm';
import {TypeOrmGameEntity} from "../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmGame.entity";
import {
    TypeOrmPublisherEntity
} from "../../../../infrastructure/adapter/persistence/typeorm/entity/typeOrmPublisher.entity";

export class TestHelper {

    private static _instance: TestHelper;

    private constructor() {}

    public static get instance(): TestHelper {
        if(!this._instance) this._instance = new TestHelper();

        return this._instance;
    }

    private dbConnect!: DataSource;

    private entities = [TypeOrmGameEntity, TypeOrmPublisherEntity] ;


    async setupTestDB():Promise<DataSource> {
        this.dbConnect = await new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: this.entities,
            synchronize: true,
            logging: false
        }).initialize();
        return this.dbConnect;
    }

    async teardownTestDB() {
        await this.dbConnect.destroy();
    }

}