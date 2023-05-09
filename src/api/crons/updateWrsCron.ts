import axios from "axios";
import { CronJob } from "cron";
import { Wr, Wrs } from "../wrs/wrs.model";

const process = async () => {
	try {
		console.log('job start at', new Date());
		for (const run_type of ['pro', 'tp']) {
			const recentWrsData = await axios.get(`https://kztimerglobal.com/api/v2.0/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&has_teleports=${run_type === 'tp'}&place_top_at_least=1&limit=20`);
			const recentWrs = recentWrsData.data;

			const cursor = Wrs.find({ has_teleports: run_type === 'tp' });
			const results = await cursor.toArray() as Wr[];
			const currentWrsMap = new Map(results.map(wr => ([wr.map_id, wr])));

			for (const recentWr of recentWrs.reverse()) {
				console.log('-------------------');
				console.log('recent wr', run_type, recentWr.map_name, recentWr.player_name);
				let currentWr = currentWrsMap.get(recentWr.map_id);
				let candidateWr = {
					map_id: recentWr.map_id,
					map_name: recentWr.map_name,
					has_teleports: recentWr.teleports > 0,
					time: recentWr.time,
					teleports: recentWr.teleports,
					player_name: recentWr.player_name,
					steamid: recentWr.steam_id,
					steamid64: recentWr.steamid64,
					created_on: recentWr.created_on
				}
				if (!currentWr) {
					console.log('no wr in db, insert wr', candidateWr.map_name, candidateWr.player_name);
					await Wrs.insertOne(candidateWr);
					currentWrsMap.set(candidateWr.map_id, candidateWr);
				} else {
					console.log('checking current wr on map', currentWr.map_name, currentWr.player_name);
					if (currentWr.created_on >= candidateWr.created_on) {
						continue;
					} else {
						console.log('updating wr', candidateWr.map_name, candidateWr.player_name);
						Wrs.findOneAndUpdate({
							map_id: candidateWr.map_id,
							has_teleports: candidateWr.has_teleports
						}, {
							$set: {
								...candidateWr
							}
						});
						currentWrsMap.set(candidateWr.map_id, candidateWr);
					}
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}

const updateWrsJob = new CronJob(
	'*/10 * * * *',
	process
)

updateWrsJob.start();