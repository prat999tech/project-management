import { apierror } from "../utils/apierror";
import { apiresponse } from "../utils/apiresponse";
class crud{
    constructor(model){
        this.model = model; // Assign the model to the instance
    }
    async create(data) {
        try {
            const createdData = await this.model.create(data);
            return new apiresponse(201, createdData, "Created successfully");
        } catch (error) {
            throw new apierror(500, "Error creating data", [error.message]);
        }
    }
    async delete(id,data){
        try {
            const deletedData = await this.model.findByIdAndDelete(data);
            if (!deletedData) {
                throw new apierror(404, "Data not found");
            }
            return new apiresponse(200, deletedData, "Deleted successfully");
        } catch (error) {
            throw new apierror(500, "Error deleting data", [error.message]);
        }
    }
    async update(id, data) {
        try {
            const updatedData = await this.model.findByIdAndUpdate(id, data,);
            if (!updatedData) {
                throw new apierror(404, "Data not found");
            }
            return new apiresponse(200, updatedData, "Updated successfully");
        } catch (error) {
            throw new apierror(500, "Error updating data", [error.message]);
        }
}
}
export default crudrepo