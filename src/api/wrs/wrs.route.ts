import { Router } from "express";
import { ParamMapName } from "../../interfaces/ParamMapName";
import { validateRequest } from "../../middlewares";
import * as WrHandler from './wrs.controller';

const router = Router();

// cant use validateRequest smh
router.get(
	'/player',
	WrHandler.getPlayersWrs
);

router.get(
	'/',
	WrHandler.getAllWrs
)

router.get(
	'/:name',
	validateRequest({
		params: ParamMapName
	}),
	WrHandler.getMapWrs
)


export default router;