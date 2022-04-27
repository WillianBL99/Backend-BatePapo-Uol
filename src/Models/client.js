import { MongoClient } from "mongodb";

const clientDB = {
    then: (calback) => {
        const mongoClient = new MongoClient(process.env.MONGO_URI);
        mongoClient.connect().then(() => {
            calback(mongoClient.db("bate_papo_uol"));
        });
    }
}

export default clientDB;