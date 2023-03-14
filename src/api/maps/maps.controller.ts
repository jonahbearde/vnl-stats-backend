import { Request, Response, NextFunction } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { ParamMapSearch } from "../../interfaces/ParamMapSearch";
import { KzMap, KzMapWithId } from './maps.model';
import { createMap, deleteMap, findAllMaps, findMapByName, findMapsLikeName, updateMap } from "./maps.service";

export async function getDistributionHandler(req: Request, res: Response, next: NextFunction) {
	try {
		const results = await findAllMaps();
		const maps = await results.toArray();
		if (maps) {
			let distribution: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
			for (const map of maps) {
				distribution[map.tpTier - 1]++;
			}
			distribution.push(maps.length);
			res.json(distribution);
		} else {
			res.status(404);
			throw new Error('cannot find all maps');
		}
	} catch (error) {
		console.log(error);
	}
}


export async function createMapHandler(req: Request<{}, KzMapWithId, KzMap>, res: Response<KzMapWithId>, next: NextFunction) {
	try {
		const body = req.body;
		const createResult = await createMap({ ...body });
		if (!createResult.acknowledged) throw new Error('error creating a map');
		res.status(201);
		res.json({
			_id: createResult.insertedId,
			...body
		});
	} catch (error) {
		next(error);
	}
}

export async function getAllMaps(req: Request, res: Response<KzMap[]>, next: NextFunction) {
	try {
		const results = await findAllMaps();
		const maps = await results.toArray();
		if (maps.length === 0) {
			res.status(404);
			throw new Error('cannot find all maps');
		}
		res.json(maps);
	} catch (error) {
		next(error);
	}
}

export async function getMapByNameHandler(req: Request<ParamMapName, KzMap, {}>, res: Response<KzMap>, next: NextFunction) {
	try {
		const result = await findMapByName(req.params.name);
		if (!result) {
			res.sendStatus(404);
			return;
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
}

export async function getMapsLikeNameHandler(req: Request<ParamMapSearch, KzMap[] | {}, {}>, res: Response<KzMap[] | {}>, next: NextFunction) {
	try {
		const results = await findMapsLikeName(req.params.name, { limit: 20 });
		const maps = await results.toArray();
		if (maps.length === 0) res.json([])
		res.json(maps);
	} catch (error) {
		next(error);
	}
}

export async function updateMapHandler(req: Request<ParamId, KzMap, KzMap>, res: Response<KzMap>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const result = await updateMap(id, { ...req.body }, { returnDocument: 'after', upsert: true });
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.json(result.value);
	} catch (error) {
	}
}

export async function deleteMapHandler(req: Request<ParamId, {}, {}>, res: Response<{}>, next: NextFunction) {
	try {
		const id = parseInt(req.params.id);
		const result = await deleteMap(id);
		if (!result.value) {
			res.sendStatus(404);
			return;
		}
		res.status(204).end();
	} catch (error) {
		next(error)
	}
}
