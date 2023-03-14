import { Router } from "express";
import { requireUser, validateRequest } from "../../middlewares";
import * as MapHandler from './maps.controller';
import { KzMap } from "./maps.model";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { ParamMapSearch } from "../../interfaces/ParamMapSearch";
import { ParamId } from "../../interfaces/ParamId";

const router = Router();

router.get(
	'/distribution',
	MapHandler.getDistributionHandler
)

router.post(
	'/',
	requireUser('Admin'),
	validateRequest({
		body: KzMap
	}),
	MapHandler.createMapHandler
);

router.put(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId,
		body: KzMap
	}),
	MapHandler.updateMapHandler
)

router.get(
	'/',
	MapHandler.getAllMaps
);

router.get(
	'/:name',
	validateRequest({
		params: ParamMapName
	}),
	MapHandler.getMapByNameHandler
);

router.get(
	'/search/:name',
	validateRequest({
		params: ParamMapSearch
	}),
	MapHandler.getMapsLikeNameHandler
);

router.delete(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId
	}),
	MapHandler.deleteMapHandler
)

export default router;


