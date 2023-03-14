// import {CronJob} from 'cron';
// import { upsertCron, updateLastRunDate } from './crons.service';
// import Logger from '../../utils/logger';

// export class Cron {
//   private job: CronJob

//   constructor (private readonly name: string, timePattern: string, process: () => Promise<void>) {
//     upsertCron(name, timePattern).then(() => {
//         this.job = new CronJob(
//           timePattern,
//           this.wrapProcess(process),
//         )

//         this.job.start()
//       })
//   }

//   private wrapProcess (process: () => Promise<void>) {
//     return async () => {
//       await process().catch(error => {
//           Logger.error(error)
//         })

//       this.afterProcess()
//     }
//   }

//   private afterProcess () {
//     updateLastRunDate(this.name)
//   }
// }
