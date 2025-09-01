//humlog multer ka use krke file ko apne local server pr apne local storage pr rkhenge fir cloudinary ka use krke main server pr daal denge
// steps to be followed:-we have assumed that file has been uploaded on a server, now we will get local path from server then we will upload it to cloudinary
import {v2 as cloudinary} from "cloudinary"
//import { log } from "console";
import fs from "fs" //this hepls in file manupulation
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });// this we have get from cloudinary documentation
////////////////////////////////////////////////////////////////////////////////////////
//hum log eek function bnayenge uss function ke parameter m file ka local path denge fir file ko upload krdenge or jb upload ho jyega fir filr ko hatadenge ya unlink krdenge
const uploadOnCloudinary=async (localFilepath)=>{
    try{
        if(!localFilepath) return null  //agar local path nhi ha toh null return krdenge
        //upload file on cloudinary
       const response = await cloudinary.uploader.upload(localFilepath,{
            resource_type:"auto",//this is to specify the type of file we are uploading
            folder:"project-management"

        })//humko ismai upload option bhi mil jate ha jaise resource type
        //file has been uploaded seccessfully
        console.log("file has been uploaded successfully and file url is",response.url);
        return response;
        
    } catch(error){
         console.log("Cloudinary upload failed:", error); // Log the actual error for debugging

        fs.unlinkSync(localFilepath)//remove the locally saved temp file as the upload operation got failed
        return null;

    }
  
}
export {uploadOnCloudinary}






//////////////////////////////////////////////////////////////////////