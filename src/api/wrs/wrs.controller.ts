import { Request, Response, NextFunction } from "express";
import { Wr } from './wrs.model';
import { findAllWrs, findMapWrs, findPlayersWrs } from "./wrs.service";
import { QueryGetWrMaps } from "../../interfaces/QueryGetWrMaps";
import { ParamMapName } from "../../interfaces/ParamMapName";


export async function getPlayersWrs(req: Request<{}, { map_name: string }[], {}, QueryGetWrMaps>, res: Response<{ map_name: string }[]>, next: NextFunction) {
	try {
		const cursor = await findPlayersWrs(req.query.steamid64, req.query.has_teleports === 'true' ? true : false);
		const results = await cursor.toArray();
		// console.log('results', results);
		// if(results.length === 0){
		// 	res.sendStatus(404);
		// 	return;
		// }
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function getAllWrs(req: Request<{}, Wr[]>, res: Response<Wr[]>, next: NextFunction) {
	try {
		const cursor = await findAllWrs();
		const results = await cursor.toArray();
		if (results.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}

export async function getMapWrs(req: Request<ParamMapName, Wr[]>, res: Response<Wr[]>, next: NextFunction) {
	try {
		const cursor = await findMapWrs(req.params.name);
		const results = await cursor.toArray();
		if (results.length === 0) {
			res.sendStatus(404);
			return;
		}
		res.json(results);
	} catch (error) {
		next(error);
	}
}