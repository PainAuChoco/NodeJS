import { LevelDB } from "../leveldb"
import WriteStream from 'level-ws'

export class User {
  public username: string
  public email: string
  public password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email
    this.password = password

    if (!passwordHashed) {
      this.setPassword(password)
    } else this.password = password
  }

  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    return new User(username, email, password)
  }

  public setPassword(toSet: string): void {
    // Hash and set password
    this.password = toSet
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    // return comparison with hashed password
    return toValidate === this.password
  }
}


export class UserHandler {
  public db: any

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data !== undefined) {
        callback(null, User.fromDb(username, data))
      }
    })
  }

  public getDb() {
    return this.db;
  }

  public getAll(
    callback: (error: Error | null, result: any | null) => void) {
    let users: User[] = []
    this.db.createReadStream()
      .on('data', function (data: any) {
        let username: string = data.key.split(':')[1]
        let email: string = data.value.split(':')[1]
        let password: string = data.value.split(':')[0]
        let user: User = new User(username, email, password)
        console.log(data.key, '=', data.value)
        users.push(user)
      })
      .on('error', function (err: any) {
        callback(err, null)
      })
      .on('close', function () {
      })
      .on('end', function () {
        callback(null, users)
      })

  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`, `${user.password}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null, message: string) => void) {
    this.db.del(`user:${username}`, function (err) {
      if (err) {
        let message = 'Deletion not completed : this username doesn\'t exist'
        callback(err, message)
      }
      else {
        let message = `The user is deleted`
        callback(null, message)
      }
    })
  } 
}