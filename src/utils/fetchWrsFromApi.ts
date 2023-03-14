import { Wr, Wrs } from "../api/wrs/wrs.model";
import { KzMaps } from "../api/maps/maps.model";
import axios from "axios";

export async function fetchWrsFromApi() {
	const results = await KzMaps.find({}).toArray();
	const kzMap = new Set(results.map(map => map.name));
	for (const map_name of kzMap) {
		const tpWrData = await axios.get(`https://kztimerglobal.com/api/v2.0/records/top?map_name=${map_name}&stage=0&modes_list_string=kz_vanilla&has_teleports=true&limit=1`);
		const tpWr = tpWrData.data[0];
		// console.log('tp wr', tpWr);
		if (tpWr) {
			const tpWrToDB: Wr = {
				map_id: tpWr.map_id,
				map_name: tpWr.map_name,
				time: tpWr.time,
				has_teleports: true,
				teleports: tpWr.teleports,
				player_name: tpWr.player_name,
				steamid: tpWr.steam_id,
				steamid64: tpWr.steamid64,
				created_on: tpWr.created_on
			}
			console.log('inserting tp', tpWr.map_name);
			await Wrs.insertOne(tpWrToDB);
		}

		const proWrData = await axios.get(`https://kztimerglobal.com/api/v2.0/records/top?map_name=${map_name}&stage=0&modes_list_string=kz_vanilla&has_teleports=false&limit=1`);
		const proWr = proWrData.data[0];
		if (proWr) {
			const proWrToDB: Wr = {
				map_id: proWr.map_id,
				map_name: proWr.map_name,
				time: proWr.time,
				has_teleports: false,
				teleports: proWr.teleports,
				player_name: proWr.player_name,
				steamid: proWr.steam_id,
				steamid64: proWr.steamid64,
				created_on: proWr.created_on
			}
			console.log('inserting pro', proWr.map_name);
			await Wrs.insertOne(proWrToDB);
		}
	}
}