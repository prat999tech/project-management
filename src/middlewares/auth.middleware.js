//yeh middleware sirf verufy krega ki user ha ya nhi

import { apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//we will use tokens to verify as when we logged in user we have gave them access token and refresh token
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        console.log("inside verifyJWT middleware");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")//token mera cookies ke and rha toh wha se maine token lia ya token as a header ke form m bhi aa skta ha toh woh bhi access lellia
        
         console.log(token);
        if (!token) {
            throw new apierror(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)//This line takes the user's access token and your secret key, checks if the token is valid and trustworthy. If it is, it gives you back the user's information that was encoded inside that token.
        console.log("decoded token: ", decodedToken);

        const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
        console.log("User from token: ", user);
    
        if (!user) {
            
            throw new apierror(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()//'router.route("/logout").post(verifyJWT,logoutUser)' -> next() se humara controller abb 'logoutUser' wle method pr chla jayeg
 
    } catch (error) {
        throw new apierror(401, error?.message || "Invalid access token")
    }
    
})
export const isStudent=(req,res,next)=>{
    if(req.user && req.user.role==='student'){
        next();
    }
    else{
        throw new apierror(403,'access denied')
}
};
export const isTeacher=(req,res,next)=>{
    if(req.user && req.user.role==='teacher'){
        next();
    }
    else{
        throw new apierror(403,'access denied')
}
};


