import app from './app';
import process from 'process';
import {connect} from './utils/connect';
import { writeMapsToDB, updateMapsFromKzgo, writeImpMapsToDB, writeUnfMapsToDB, writeBonusesToDB } from './utils/updateMapsFromApi';
import { fetchWrsFromApi } from './utils/fetchWrsFromApi';
const port = process.env.PORT || 5000;
app.listen(port, async () => {
	await connect();
  console.log(`Listening: http://localhost:${port}`);
	// running this pre-release
	// await writeMapsToDB();
	// await updateMapsFromKzgo();
	// await writeImpMapsToDB();
	// await writeUnfMapsToDB();
	// await writeBonusesToDB();
	// await fetchWrsFromApi();


	import('./api/crons');
});


