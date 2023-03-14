import axios from "axios";
import { KzMaps } from "../api/maps/maps.model";
import { Uncompleteds } from "../api/uncompleted/uncompleted.model";
import sheetdb from 'sheetdb-node';
import { Bonuses } from "../api/bonus/bonus.model";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 6);

// write maps from vnl sheet to db pre-release
const config = {
	// address: 'syv3mek8alz7u',
	address: 'ippviiyz4sl70'
};
const client = sheetdb(config);

// run this pre-release
export const writeMapsToDB = async () => {
	try {
		const data = await client.read({ limit: 1000, sheet: 'Map Tiers' });
		const maps = JSON.parse(data);
		if (maps) {
			for (const map of maps) {
				// console.log(map);
				const name = map['Maps & Videos'].trim();
				const tpTier = parseInt(map['TP Tier']);
				const proTier = parseInt(map['PRO Tier']);
				const notes = map['Notes'];
				console.log('inserting...', name, tpTier);
				// push to database
				KzMaps.insertOne({
					id: -1,
					name: name,
					tpTier: tpTier,
					proTier: proTier,
					kztTier: -1,
					notes: notes,
					workshopId: '',
					mapperNames: [],
					mapperIds: [],
					releaseDate: ''
				});
			}
		}
	} catch (error) {
		console.log('read sheet error', error);
	}
}

// impossible maps
export const writeImpMapsToDB = async () => {
	try {
		const data = await client.read({ limit: 1000, sheet: 'Impossible Maps' });
		const maps = JSON.parse(data);
		if (maps) {
			for (const map of maps) {
				// console.log(map);
				const name = map['Impossible Maps'].trim();
				const globalTier = parseInt(map['Global Tier']);
				const notes = map['Notes'];

				//get map id from kzgo
				const result = await axios.get(`https://kztimerglobal.com/api/v2.0/maps/name/${name}`);
				const map_id = result.data ? result.data.id : -1;
				const release = result.data ? result.data.updated_on : '';

				console.log('inserting...', name, map_id, globalTier);
				// push to database
				Uncompleteds.insertOne({
					map_id: map_id,
					map_name: name,
					kztTier: globalTier,
					notes: notes,
					type: 0,
					releaseDate: release
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
}

export const writeUnfMapsToDB = async () => {
	try {
		const data = await client.read({ limit: 1000, sheet: 'Unfeasible Maps' });
		const maps = JSON.parse(data);
		if (maps) {
			for (const map of maps) {
				// console.log(map);
				const name = map['Unfeasible Maps'].trim();
				const globalTier = parseInt(map['Global Tier']);
				const notes = map['Notes'];

				const result = await axios.get(`https://kztimerglobal.com/api/v2.0/maps/name/${name}`);
				const map_id = result.data ? result.data.id : -1;
				const release = result.data ? result.data.updated_on : '';

				console.log('inserting...', name, map_id, globalTier);
				// push to database
				Uncompleteds.insertOne({
					map_id: map_id,
					map_name: name,
					kztTier: globalTier,
					notes: notes,
					type: 1,
					releaseDate: release
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
}

export const writeBonusesToDB = async () => {
	try {
		const data = await client.read({ limit: 280, sheet: 'Bonuses' });
		const maps = JSON.parse(data);
		// console.log('maps', maps);
		if (maps) {
			for (const map of maps) {
				// console.log(map);
				const name = map['Map'].trim();
				const bonus_number = parseInt(map['B']);
				const tpTier = parseInt(map['TP']);
				const proTier = parseInt(map['PRO']);
				const notes = map['Notes'];

				const result = await axios.get(`https://kztimerglobal.com/api/v2.0/maps/name/${name}`);
				const map_id = result.data ? result.data.id : -1;

				console.log('inserting...', name, map_id, bonus_number, tpTier);
				// push to database
				Bonuses.insertOne({
					id: parseInt(nanoid()),
					map_id: map_id,
					map_name: name,
					bonus_number: bonus_number,
					tpTier: tpTier,
					proTier: proTier,
					notes: notes,
				});
			}
		}
	} catch (error) {
		console.log(error);
	}
}

// pre-release
export const updateMapsFromKzgo = async () => {
	try {
		const vnlMaps = await KzMaps.find({}).toArray();
		const vnlSet = new Set(vnlMaps.map(map => map.name));
		const results = await axios.get(`https://kzgo.eu/api/maps`);
		const kzgoMaps = results.data;
		let index = 1;
		for (const map of kzgoMaps) {
			if (!vnlSet.has(map.name)) {
				continue;
			}
			console.log('updating map...', map.name, index);
			const map_id = map.id;
			const kztTier = map.tier;
			const workshopId = map.workshopId;
			const mapperNames = map.mapperNames;
			const mapperIds = map.mapperIds;
			const rlsDate = map.date;
			KzMaps.findOneAndUpdate(
				{ name: map.name },
				{
					$set: {
						id: map_id,
						kztTier: kztTier,
						workshopId: workshopId,
						mapperIds: mapperIds,
						mapperNames: mapperNames,
						releaseDate: rlsDate
					}
				}
			);
			index++;
		}
	} catch (error) {
		console.log(error);
	}
}


// export const updateMapsFromApi = async () => {
// 	try {
// 		const vnlMaps = await KzMaps.find({}).toArray();
// 		const vnlMap = new Map(vnlMaps.map(map => ([map.name, map.releaseDate])));
// 		for (const mapName of vnlMap.keys()) {
// 			// no releaseDate, need update
// 			if (!vnlMap.get(mapName)) {
// 				console.log('map to update', mapName);
// 				const mapData = await axios.get(`https://kztimerglobal.com/api/v2.0/maps/name/${mapName}`);
// 				let tier: number = mapData.data.difficulty;
// 				let rlsDate: string = mapData.data.created_on;
// 				KzMaps.updateOne(
// 					{ name: mapName },
// 					{
// 						$set: {
// 							kztTier: tier,
// 							releaseDate: rlsDate
// 						}
// 					}
// 				);
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// interface IWorkshopFileDetails {
// 	publishedfileid: string,
// 	result: number
// 	creator: string,
// 	creator_app_id: number,
// 	consumer_app_id: number,
// 	filename: string,
// 	file_size: number,
// 	file_url: string,
// 	hcontent_file: string,
// 	preview_url: string,
// 	hcontent_preview: string,
// 	title: string,
// 	description: string,
// 	time_created: number,
// 	time_updated: number,
// 	visibility: number,
// 	banned: number,
// 	ban_reason: string,
// 	subscriptions: number,
// 	favorited: number,
// 	lifetime_subscriptions: number,
// 	lifetime_favorited: number,
// 	views: number,
// 	tags: { tag: string }[],
// }

// interface ICollectionDetails {
// 	publishedfileid: string,
// 	result: number,
// 	children: {
// 		publishedfileid: string,
// 		sortorder: number,
// 		filetype: number
// 	}[]
// }

// const fatherCollectionID = '2838349431';

// export const updateFromWorkshop = async () => {
// 	const mapResults = await KzMaps.find({}).project({ name: 1, workshopId: 1 }).toArray();
// 	if (!mapResults) throw new Error('error finding all maps');
// 	const dbMap = new Map(mapResults.map(map => ([map.name, map.workshopId])));
// 	for (const mapName of dbMap.keys()) {
// 		// no workshop id, need update
// 		if (!dbMap.get(mapName)) {
// 			// fetch file id from api
// 			const mapData = await axios.get(`https://kztimerglobal.com/api/v2.0/maps/name/${mapName}`);
// 			let url = new URL(mapData.data.workshop_url);
// 			let params = new URLSearchParams(url.searchParams);
// 			let id = params.get('id') ?? '';
// 			console.log('file ', mapName, id);
// 			if(!id) continue;

// 			// update
// 			const mapperIds: string[] = [];
// 			const mapperNames: string[] = [];
// 			// get workshop file
// 			const workshopFileDetails = await getWorkshopFileDetails(id);
// 			const mapperName = await getMapperName(workshopFileDetails.creator);
// 			mapperNames.push(mapperName);
// 			mapperIds.push(workshopFileDetails.creator);
// 			const query = { name: mapName };
// 				const update = {
// 					$set: {
// 						mapperNames: mapperNames,
// 						mapperIds: mapperIds,
// 						workshopId: id
// 					}
// 				};
// 				// update
// 				KzMaps.updateOne(query, update);
// 		}
// 	}
// }

// const getCollectionDetails = async (collectionID: string): Promise<ICollectionDetails> => {
// 	const url = 'http://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/';
// 	const res = await axios.post(url, `collectioncount=1&publishedfileids[0]=${collectionID}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
// 	return res.data.response.collectiondetails[0];
// }

// const getWorkshopFileDetails = async (workshopID: string): Promise<IWorkshopFileDetails> => {
// 	const url = 'http://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';
// 	const res = await axios.post(url, `itemcount=1&publishedfileids[0]=${workshopID}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
// 	return res.data.response.publishedfiledetails[0];
// }

// const getMapperName = async (steamId64: string): Promise<string> => {
// 	const res = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId64}`);
// 	return res.data.response.players[0].personaname;
// }

