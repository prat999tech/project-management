import { User } from '../models/user.model.js';
import { CrudRepository } from './crud.js';

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async findByEmailOrUsername(email, username) {
        const user = await this.model.findOne({
            $or: [{ email }, { username }]
        });
        return user;
    }
    async findbyid(userid){
        const user=await this.model.findById(userid).select("-password -refreshtoken");
        return user;
    }
    
}

export { UserRepository };
