class apierror extends Error { // Line 1: Class definition and inheritance
    constructor( // Line 2: Constructor start
        statusCode, // Line 3: statusCode parameter
        message= "Something went wrong", // Line 4: message parameter with default value
        errors = [], // Line 5: errors parameter with default value
        stack = "" // Line 6: stack parameter with default value
    ){ // Line 7: Constructor body start
        super(message) // Line 8: Call parent class constructor
        this.statusCode = statusCode // Line 9: Assign statusCode to instance
        this.data = null // Line 10: Assign null to data property of instance
        this.message = message // Line 11: Assign message to instance (redundant)
        this.success = false; // Line 12: Assign false to success property of instance
        this.errors = errors // Line 13: Assign errors array to instance

        if (stack) { // Line 14: Check if a stack trace was provided
            this.stack = stack // Line 15: Use the provided stack trace
        } else{ // Line 16: If no stack trace was provided
            Error.captureStackTrace(this, this.constructor) // Line 17: Capture a new stack trace
        }

    } // Line 19: Constructor body end
} // Line 20: Class definition end

export {apierror} // Line 22: Export the class
/*


This ApiError class creates custom error objects that are more structured than standard JavaScript Error objects. When an error occurs in your API, instead of just throwing a generic Error, you can throw an ApiError that includes:

An HTTP statusCode (like 400 for Bad Request, 401 for Unauthorized, 404 for Not Found, 500 for Internal Server Error).
A user-friendly message.
An array of more detailed errors (e.g., validation errors for specific fields).
A success: false property, which is useful for consistent API response structures.
The original error stack trace, which is crucial for debugging.


super(message):-
Calls the constructor of the parent class (Error), passing the message received by the ApiError constructor. This sets the standard message property (and sometimes a default stack trace) that all Error objects have.

Line 11: this.message = message
Takes the message value and assigns it to the message property on the instance. Note: The super(message) call on Line 8 already sets the message property because it's a standard part of the parent Error class. This line is technically redundant but harmless; it just re-assigns the same value




*/
//ABB YAHA SE EEK OR CEHCK LGANA HOGA KI JBB BHI HUMARA ERROR AAYE TOH WOH API ERROR KE THROUGH HI JAYE TOH WOH CHECKING MIDDLEWARES M LGEGA