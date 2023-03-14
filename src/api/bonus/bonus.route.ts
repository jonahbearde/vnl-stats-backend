import { Router } from "express";
import { ParamId } from "../../interfaces/ParamId";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { requireUser, validateRequest } from "../../middlewares";
import * as BonusesHandlers from "./bonus.controller";
import { Bonus } from "./bonus.model";

const router = Router();

router.post(
	'/',
	requireUser('Admin'),
	validateRequest({
		body: Bonus
	}),
	BonusesHandlers.createBonusHandler
)

router.get(
	'/',
	BonusesHandlers.getAllBonusesHandler
)

router.get(
	'/:name',
	validateRequest({
		params: ParamMapName
	}),
	BonusesHandlers.getBonusesByNameHandler
)

router.put(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId,
		body: Bonus
	}),
	BonusesHandlers.updateBonusHandler
)

router.delete(
	'/:id',
	requireUser('Admin'),
	validateRequest({
		params: ParamId
	}),
	BonusesHandlers.deleteBonusHandler
)

export default router;