import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test_users'
var dbUser: UserHandler

describe('User', function () {
    before(function () {
        LevelDB.clear(dbPath)
        dbUser = new UserHandler(dbPath)
    })

    after(function () {
        dbUser.getDb().close()
    })

    describe('#save', function () {
        it('should save user', function () {
            let user: User = new User("username", "email", "password")
            dbUser.save(user, function (err: Error | null) {
                expect(err).to.be.undefined
            })
        })
    })

    describe('#get', function () {
        it("should get user", function () {
            let user: User = new User("username", "email", "password")
            dbUser.save(user, function () {
                dbUser.get("username", function (err: Error | null, result?: User) {
                    expect(result).to.not.be.undefined
                    if(result !== undefined && result !== null) expect(result.username).to.be.equal("username")
                })
            })
        })
    })

    describe('#update', function () {
        it("should update user", function () {
            let user: User = new User("username", "email", "password")
            dbUser.save(user, function () {
                user.email = "new_email"
                dbUser.save(user, function () {
                    dbUser.get("username", function (err: Error | null, result?: User) {
                        expect(result).to.not.be.undefined
                        if (result !== undefined && result !== null) expect(result.email).to.be.equal("new_email")
                    })
                })
            })
        })
    })

    describe('#delete', function () {
        it("should delete user", function () {
            let user: User = new User("username", "email", "password")
            dbUser.save(user, function (err: Error | null) {
                dbUser.delete("username", function (err: Error | null) {
                    expect(err).to.be.null;
                })
            })
        })
    })
})