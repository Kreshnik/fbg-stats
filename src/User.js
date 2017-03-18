export default class User{
    
    constructor(id, name, isAdmin) {
        this.id = id;
        this.name = name;
        this.isAdmin = isAdmin;
        this.posts = [];
    }
    
    numberOfPost(){
        return this.posts.length;
    }

}