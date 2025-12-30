// responses.js

const loginResponses = {
    success: {
        "jwt": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfQURNSU4iLCJzdWIiOiJhZG1pbiIsImlhdCI6MTc2NjU3MjM5OCwiZXhwIjoxNzY2NTczMjk4LCJpc3MiOiJnZW5jX2NvaG9ydCIsImF1ZCI6WyJHZW5DIl19.dSTut-4zJG82AfkI658wVjhE47egq2vDekdJa6_JkmA",
        "userId": "admin",
        "firstName": "Project Admin",
        "lastName": "genc",
        "role": "Admin",
        "email": "quickbytegenc@cognizant.com",
        "phone": "7567171234"
    },
    failure: {
        success: false,
        message: 'Invalid username or password',
    },
};

//ROLE_USER
//eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IlJPTEVfVVNFUiIsInN1YiI6InVzZXIiLCJpYXQiOjE3NjY1NzI0NzAsImV4cCI6MTc2NjU3MzM3MCwiaXNzIjoiZ2VuY19jb2hvcnQiLCJhdWQiOlsiR2VuQyJdfQ.WVZa4KOiboCt3Wp-Pd4netczx2hib7qQEbU_jBaxeM8

const profileResponses = {
    success: {
        success: true,
        message: 'User profile retrieved successfully',
    },
    failure: {
        success: false,
        message: 'User not found',
    },
};

module.exports = {
    loginResponses,
    profileResponses,
};