import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'


export class MetricsHandler {
  private db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public getDb()
  {
    return this.db;
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
    const result = this.db.get(key);
    callback(null, result)
  }

  public delete(key: string, callback: (error: Error | null, result: any) => void) {
		this.db.del( `metric:${key}`,function(err){
			if(err)	{
				let message = 'Deletion not completed : this metric doesn\'t exist'
				callback(err, message)
			}
		})

		let message = `The metric is deleted`
		callback(null, message)
	}

  public getOne(key: string,
    callback: (error: Error | null, result: any | null) => void) {
    let result: Metric
    this.db.createReadStream()
      .on('data', function (data: any) {
        let timestamp: string = data.key.split(':')[1]
        let metric: Metric = new Metric(timestamp, data.value)
        console.log(data.key, '=', data.value)
        if(key == data.key)
        {
          result = metric
        }
      })
      .on('error', function (err: any) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, result)
        console.log('Stream ended')
      })
  }


  public getAll(
    callback: (error: Error | null, result: any | null) => void) {
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data: any) {
        let timestamp: string = data.key.split(':')[1]
        let metric: Metric = new Metric(timestamp, data.value)
        console.log(data.key, '=', data.value)
        metrics.push(metric)
      })
      .on('error', function (err: any) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        callback(null, metrics)
        console.log('Stream ended')
      })

  }
}

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}