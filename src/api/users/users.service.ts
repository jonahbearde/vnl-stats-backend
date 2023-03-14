import { FindOptions, InsertOneOptions, OptionalUnlessRequiredId } from "mongodb";
import { User, Users } from "./users.model";

export async function findUserByName(name: string, options?: FindOptions) {
	return Users.findOne({ name }, { ...options });
}

export async function createUser(doc: OptionalUnlessRequiredId<User>, options?: InsertOneOptions) {
	return Users.insertOne(doc, { ...options });
}