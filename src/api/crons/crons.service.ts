import { UpdateOptions } from "mongodb";
import { Crons } from "./crons.model";

export async function findCronByName(name: string){
	return Crons.findOne({name});
}

export async function upsertCron(name: string, timePattern: string){
	return Crons.updateOne(
		{name},
		{$set: {timePattern}},
		{upsert: true}
	)
}

export async function updateLastRunDate(name: string){
	return Crons.updateOne(
		{name},
		{$currentDate: {lastRunDate : true}}
	)
}