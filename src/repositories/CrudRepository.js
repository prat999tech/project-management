import { apierror } from "../utils/apierror.js";
import { redisClient } from "../db/redis.db.js";

/**
 * A generic repository for CRUD operations with built-in cache invalidation.
 */
class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const createdData = await this.model.create(data);
            return createdData;
        } catch (error) {
            console.error(`Error in CrudRepository create for ${this.model.modelName}:`, error);
            throw new apierror(500, "Error creating data in repository");
        }
    }

    async delete(id) {
        try {
            const deletedData = await this.model.findByIdAndDelete(id);
            if (!deletedData) {
                throw new apierror(404, "Data not found for deletion");
            }

            // --- Cache Invalidation ---
            const cacheKey = `${this.model.modelName}:${id}`;
            if (redisClient && redisClient.isOpen) {
                await redisClient.del(cacheKey);
                console.log(`CACHE INVALIDATED for key: ${cacheKey}`);
            }

            return deletedData;
        } catch (error) {
            console.error(`Error in CrudRepository delete for ${this.model.modelName}:`, error);
            throw new apierror(500, "Error deleting data in repository");
        }
    }

    async update(id, data) {
        try {
            const updatedData = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (!updatedData) {
                throw new apierror(404, "Data not found for update");
            }

            // --- Cache Invalidation ---
            const cacheKey = `${this.model.modelName}:${id}`;
            if (redisClient && redisClient.isOpen) {
                await redisClient.del(cacheKey);
                console.log(`CACHE INVALIDATED for key: ${cacheKey}`);
            }

            return updatedData;
        } catch (error) {
            console.error(`Error in CrudRepository update for ${this.model.modelName}:`, error);
            throw new apierror(500, "Error updating data in repository");
        }
    }
}

export { CrudRepository };
