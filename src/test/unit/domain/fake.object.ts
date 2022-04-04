import { v4 } from 'uuid';

export class FakeObject {
    static PUBLISHER_OBJECT = { id: v4(),  slug: "Publisher1-104154", name: 'PublisherA', siret: 104154, phone: "+24324445" };
    static GAME_OBJECT = { id: v4(),  slug: "Game1-Publisher1", title:"Game1", publisher: this.PUBLISHER_OBJECT,tags:["tag1","tag2"],price: 8, releaseDate: "04/04/2022" };
    static GAME_OBJECT2 = { id: v4(),  slug: "Game2-Publisher1", title:"Game2", publisher: this.PUBLISHER_OBJECT,tags:["tag3","tag4"],price: 10, releaseDate: "04/04/2022" };

}