/*const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }
*/
const asyncHandler = (requestHandler) => {
    // It returns a new function that Express can use as a route handler
    return (req, res, next) => {
        // Promise.resolve() is used to ensure that the requestHandler's result
        // is treated as a Promise, even if it's not explicitly async or doesn't return a Promise.
        // If the Promise resolves successfully, nothing more happens here.
        // If the Promise rejects (an error occurs), the .catch() block is executed.
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            // The error is passed to the next() function, which will trigger
            // Express's error handling middleware (if you have one defined).
            next(err)
        )
    }
}

// Export the asyncHandler function so it can be imported and used in other files.
// This is the ONLY export statement for asyncHandler in this file.
export { asyncHandler }
 //we use this method if we have to handle web request only



// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}


// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }