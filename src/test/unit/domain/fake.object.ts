import { v4 } from 'uuid';

export class FakeObject {
    static PUBLISHER_OBJECT = { id: v4(),  slug: "Publisher1-104154", name: 'Publisher1', siret: 104154, phone: "+24324445" };
    static PUBLISHER_OBJECT2 = { id: v4(),  slug: "Publisher2-5145645", name: 'Publisher2', siret: 5145645, phone: "+5465421" };
    static GAME_OBJECT = { id: v4(),  slug: "Game1-Publisher1", title:"Game1", publisher: this.PUBLISHER_OBJECT,tags:["tag1","tag2"],price: 10, releaseDate: "04/04/2022" };
    static GAME_OBJECT2 = { id: v4(),  slug: "Game2-Publisher1", title:"Game2", publisher: this.PUBLISHER_OBJECT,tags:["tag3","tag4"],price: 20, releaseDate: "04/02/2021" };
    static GAME_OBJECT3 = { id: v4(),  slug: "Game3-Publisher2", title:"Game3", publisher: this.PUBLISHER_OBJECT2,tags:["tag5","tag6"],price: 40, releaseDate: "04/02/2020" };
}