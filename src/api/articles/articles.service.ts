import { Article, Articles, Comment } from "./articles.model";
import { FindOneAndUpdateOptions, FindOptions, InsertOneOptions, OptionalUnlessRequiredId, MatchKeysAndValues, FindOneAndDeleteOptions } from "mongodb";

export async function createArticle(doc: OptionalUnlessRequiredId<Article>, options?: InsertOneOptions) {
	return Articles.insertOne(doc, { ...options });
}

export async function findAllArticles(options?: FindOptions) {
	return Articles.find({}, { ...options });
}


export async function findArticlesByTag(tag: string, options?: FindOptions) {
	return Articles.find({ tag });
}

export async function updateArticle(id: number, updateFilter: MatchKeysAndValues<Article>, options?: FindOneAndUpdateOptions) {
	return Articles.findOneAndUpdate({ id }, { $set: updateFilter }, { ...options });
}

export async function deleteArticle(id: number, options?: FindOneAndDeleteOptions) {
	return Articles.findOneAndDelete({ id }, { ...options });
}

export async function createComment(id: number, comment: Comment, options?: FindOneAndUpdateOptions) {
	return Articles.findOneAndUpdate({ id }, { $push: { comments: comment } }, { ...options });
}

export async function deleteComment(id: number, user_id: number, options?: FindOneAndUpdateOptions) {
	return Articles.findOneAndUpdate({ id }, { $pull: { comments: { user_id } } }, { ...options });
}