export default class User{
    
    constructor(name) {
        this.name = name;
        this.posts = [];
    }
    
    numberOfPost(){
        return this.posts.length;
    }

}