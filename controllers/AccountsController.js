const Repository = require('../models/Repository');
const TokenManager = require('../tokenManager');
const utilities = require("../utilities");
const User = require('../models/user');

module.exports = 
class AccountsController extends require('./Controller') {
    constructor(req, res){
        super(req, res);
        this.usersRepository = new Repository('Users');
    }

    // list of users with masked password
    index(id) {
        if(!isNaN(id)) {
            let user =  this.usersRepository.get(id);
            if (user != null) {
                let userClone = {...user};
                userClone.Password = "********";
                this.response.JSON(userClone);
            }
        }
        else {
            let users = this.usersRepository.getAll();
            let usersClone = users.map(user => ({...user}));
            for(let user of usersClone) {
                user.Password = "********";
            }
            this.response.JSON(usersClone);
        }
    }

    // POST: /token body payload[{"Email": "...", "Password": "...", "grant-type":"password"}]
    login(loginInfo) {
        // to do assure that grant-type is present in the request header
        let user =  this.usersRepository.findByField("Email", loginInfo.Email);
        if (user != null) {
            if (user.Password == loginInfo.Password) {
                let res = TokenManager.create(user.Email);
                res["userId"] = user.Id;
                res["email"] = user.Email;
                res["username"] = user.Name;
                this.response.JSON(res);
            } else
                this.response.badRequest();
        } else
            this.response.badRequest();
    }
    
    // POST: account/register body payload[{"Id": 0, "Name": "...", "Email": "...", "Password": "..."}]
    register(user) {  
        user.Created = utilities.nowInSeconds();
        // validate User before insertion
        if (User.valid(user)) {
            // avoid duplicates Email
            if (this.usersRepository.findByField('Email', user.Email) == null) {
                // take a clone of the newly inserted user
                let newUser = {...this.usersRepository.add(user)};
                if (newUser) {
                    // mask password in the json object response
                    newUser.Password = "********";
                    this.response.created(newUser);
                } else
                    this.response.internalError();
            } else
                this.response.conflict();
        } else
            this.response.unprocessable();
    }
    // PUT: account/change body payload[{"Id": 0, "Name": "...", "Email": "...", "Password": "..."}]
    change(user) {
        if (this.requestActionAuthorized()) {
            //user exists?
            let userToChange = this.usersRepository.get(user.Id);
            if(userToChange != null){
                //user changed password?
                if(user.Password == '')
                    user.Password = userToChange.Password;
                user.Created = userToChange.Created;
                //validate user object
                if(User.valid(user)){
                    this.usersRepository.update(user);
                    this.response.JSON(user);
                }
                else {
                    this.response.unprocessable();
                }
            }
        } else
            this.response.unAuthorized();
    }
    // DELETE: account/remove body payload[{"Id": 0, "Name": "...", "Email": "...", "Password": "..."}]
    remove(id) {
        if (this.requestActionAuthorized()) {
            if(this.usersRepository.remove(id)){
                let bmRepository = new Repository('Bookmarks');
                let data = bmRepository.getAll();
                let idToDelete = [];
                data.forEach( bookmark => {
                    if(bookmark.UserId == id)
                        idToDelete.push(bookmark.Id);
                });
                idToDelete.forEach( i => {
                    bmRepository.remove(i);
                });
                const Cache = require('../cache');
                Cache.clear("/api/bookmarks");
                this.response.accepted();
            }
            else
                this.response.notFound();
        } 
        else
            this.response.unAuthorized();
    }
}