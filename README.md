# SAYARI ASSIGNMENT BACKEND CODE

    Backend application that replicates the features of stackoverflow: like user sigUp, user sigIn, add, update, delete, view question,
    add, update, delete comment, add, update, delete answer.

    In this application I have added additional feature i.e. EMAIL verification via OTP (using nodemailer).
    In this application the delete feature implemented does soft delete: meaning data is not lost from DB.

    1. Stack used: Typescript + PostgreSQL + Express + Sequelize (ORM)
    2. Deployed on AWS ec2 => http://54.82.111.197:4000

## API END POINTS:

    - SignUp: http://54.82.111.197:4000/api/v1/signUp
        - HTTP method: POST
        - Request payload: {
            "name": <name_of_the_user>,
            "email": <email_address>,
            "password": <plaintext_password>
        }
        - Response payload if successful: {
            statusCode: 201,
            success: true,
            message: 'Verify using otp sent in email!',
            data: {
                "id": <user_id_generated_in_DB: integer auto-increments>,
                "name": <name_of_the_user: string 256 char>,
                "email": <email_address: string 256 char>
            }
        }
        - Response if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }



    - Verify OTP: http://54.82.111.197:4000/api/v1/user/verifyOtp
        - HTTP method: POST
        - Request payload: {
                "userId": <user_id_generated_in_DB: integer>,
                "otp": <otp_received_in_you_email: string>
            }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "User email has been verified!",
            data: {
                "id": <user_id_generated_in_DB: integer>,
                "accessToken": <jwt_id_token: string>,
                "refreshToken": <jwt_refresh_token: string>,
                "status": active
            } 
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - SignIn: http://54.82.111.197:4000/api/v1/signIn
        - HTTP method: POST
        - Request payload: {
                "email": <email_address>,
                "password": <plaintext_password>
            }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "You have successfully logged-in",
            data: {
                "id": <user_id_generated_in_DB: integer>,
                "email": <email_address: string>,
                "status": active,
                "idToken": <jwt_id_token: string>,
                "refreshToken": <jwt_refresh_token: string>,
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Add Question: http://54.82.111.197:4000/api/v1/question/add/:<user_id_generated_in_DB: question_user>
        - HTTP method: POST
        - Request payload: {
            "title": <title_of_question: string cannot exceed 256 char>
            "body": <body_of_question: string cannot exceed 256 char>
        }
        - Response payload if successful: {
            statusCode: 201,
            success: true,
            message: "Question created!",
            data: {
                isDeleted: false <by default it's false: boolean>,
                "id": <question_id_generated_in_DB: integer>,
                "title": <title_of_question: string 256 char>,
                "body": <body_of_question: string 256>,
                "userId": <user_who_created_question: user_id_generated_in_DB: integer>,
                "updatedAt": <timestamp_question_updated>,
                "createdAt": <timestamp_question_created>,
                "user": {
                    "id": <user_who_created_question: user_id_generated_in_DB: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>,
        }


    - Add Question: http://54.82.111.197:4000/api/v1/question/add/<user_id_generated_in_DB: question_user>
        - HTTP method: POST
        - Request payload: {
            "title": <title_of_question: string cannot exceed 256 char>,
            "body": <body_of_question: string cannot exceed 256 char>
        }
        - Response payload if successful: {
            statusCode: 201,
            success: true,
            message: "Question created!",
            data: {
                isDeleted: false <by default it's false: boolean>,
                "id": <question_id_generated_in_DB: integer>,
                "title": <title_of_question: string>,
                "body": <body_of_question: string>,
                "userId": <user_who_created_question: user_id_generated_in_DB: integer>,
                "updatedAt": <timestamp_question_updated>,
                "createdAt": <timestamp_question_created>,
                "user": {
                    "id": <user_who_created_question: user_id_generated_in_DB: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }

    -Update Question: http://54.82.111.197:4000/api/v1/question/update/<user_id_generated_in_DB: question_user>
        - HTTP method: PUT
        - Request payload: {
            "title": <title_of_question: string cannot exceed 256 char>,
            "body": <body_of_question: string cannot exceed 256 char>
            "id": <question_id_generated_in_DB>
        }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "Question updated!",
            "data": {
                "id": <question_id_generated_in_DB: integer>,
                "userId": <user_id_generated_in_DB: integer>,
                "title": <title_of_question: string>,
                "body": <body_of_question: string>,
                "isDeleted": false <by default it's false: boolean>,
                "updatedAt": <timestamp_question_updated>,
                "createdAt": <timestamp_question_created>,
                "user": {
                    "id": <user_id_generated_in_DB: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Delete Question: http://54.82.111.197:4000/api/v1/question/delete
        -HTTP method: DELETE
        - Request payload: {
            "questionId": <question_id_generated_in_DB>,
            "userId": <user_id_generated_in_DB>
        }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "Question Deleted!"
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    -View Question: 54.82.111.197:4000/api/v1/question/view/<question_id_generated_in_DB>
        -HTTP method: GET
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "Question, Comments and Answer found!",
            data: {
                "id": <question_id_generated_in_DB: integer>,
                "userId": <user_id_generated_in_DB: integer>,
                "title": <question_title: string 256 char>,
                "body": <question_body: string 256 char>,
                "isDeleted": false <boolean: by default it's false>,
                "updatedAt": <timestamp_question_updated>,
                "createdAt": <timestamp_question_created>,
                "comments": [
                    {
                        "index": <integer>,
                        "id": <commentId_generated_in_DB: integer>,
                        "userId": <user who commented: user_id_generated_in_DB: integer>,
                        "questionId": <question_id_generated_in_DB: integer>,
                        "body": <comment_body: string 256 char>,
                        "isDeleted": false <boolean: by default it's false>,
                        "updatedAt": <timestamp_comment_updated>,
                        "createdAt": <timestamp_comment_created>,
                    }, {...comment_data}, {...comment_data}
                ]
                "answer": [
                    {
                        "index": <integer>,
                        "id": <answerId_generated_in_DB: integer>,
                        "userId": <user who answered: user_id_generated_in_DB: integer>,
                        "questionId": <question_id_generated_in_DB: integer>,
                        "body": <comment_body: string 256 char>,
                        "isAccepted": false <boolean: by default it's false>,
                        "isDeleted": false <boolean: by default it's false>,
                        "updatedAt": <timestamp_answer_updated>,
                        "createdAt": <timestamp_answer_created>
                    }, {...answer_data}, {...answer_data}
                ]
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Add Comment: http://54.82.111.197:4000/api/v1/comment/add/<user_id_generated_in_DB: comment_user>
        -HTTP method: POST
        - Request payload: {
            "body": <body_of_comment: string cannot exceed 256 char>,
            "questionId": <question_id_generated_in_DB: integer>
        }
        - Response payload if successful: {
            statusCode: 201,
            success: true,
            message: "Comment created!",
            data: {
                "id": <comment_id_generated_in_DB: integer>,
                "body": <comment_body: string 256 char>,
                "user": {
                    "id": <user_id_generated_in_DB: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Update Comment: http://54.82.111.197:4000/api/v1/comment/update/<user_id_generated_in_DB: comment_user>
        - HTTP method: PUT
        - Request payload: {
            "body": <comment_body: string 256 char>,
            "questionId": <question_id_in_DB: question id associated with the comment made: integer>,
            "id": <comment_id_in_DB: integer>
        }
        - Response payload if successful {
            statusCode: 200,
            success: true,
            message: "Comment updated!",
            data: {
                "success": true,
                "message": "Comment found!",
                "data": {
                        "id": <comment_id_in_DB: integer>,
                        "userId": <user_id_generated_in_DB: user who commented: integer>,
                        "questionId": <question_id_in_DB: question id associated with the comment made: integer>,
                        "body": <comment_body>,
                        "isDeleted": false <boolean: by default it's false>,
                        "updatedAt": <timestamp_comment_updated>,
                        "createdAt": <timestamp_comment_created>
                    },
                "user": {
                    "id": <user_id_generated_in_DB: user who commented: integer>,
                    "name": <user_name>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Delete Comment: http://54.82.111.197:4000/api/v1/comment/delete
        - HTTP method: DELETE
        - REquest Payload: {
            "commentId": <comment_id_in_DB: comment that needs to be deleted>,
            "userId": <user_id_in_DB: user who commented and wish to delete their comment>
        }
        - Response payload if successful {
            statusCode: 200,
            success: true,
            message: "Comment deleted!"
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Add Answer: http://54.82.111.197:4000/api/v1/answer/add/<user_id_generated_in_DB: answer_user>
        - HTTP method: POST
        - Request payload: {
            "body": <answer_body: string 256 char>,
            "questionId": <question_id_in_DB: integer>
        }
        - Response payload if successful: {
            statusCode: 201,
            success: true,
            message: "Answer created!",
            data: {
                "id": <answer_id_generated_in_DB: integer>,
                "body": <answer_body: string 256 char>,
                "user": {
                    "id": <user_id_in_DB: user who made the answer: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Update Answer: http://54.82.111.197:4000/api/v1/answer/update/<user_id_generated_in_DB: answer_user>
        - HTTP method: PUT
        - Request payload: {
            "body": <answer_body: string 256 char>,
            "questionId": <question_id_in_DB: question id associated with the answer made: integer>,
            "id": <answer_id_in_DB: integer>
        }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "Answer updated!",
            data: {
                "id": <answerId_generated_in_DB: integer>,
                "userId": <user who answered: user_id_generated_in_DB: integer>,
                "questionId": <question_id_generated_in_DB: integer>,
                "body": <comment_body: string 256 char>,
                "isAccepted": false <boolean: by default it's false>,
                "isDeleted": false <boolean: by default it's false>,
                "updatedAt": <timestamp_answer_updated>,
                "createdAt": <timestamp_answer_created>,
                "user": {
                    "id": <user who answered: user_id_generated_in_DB: integer>,
                    "name": <user_name: string>
                }
            }
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }


    - Delete User: http:54.82.111.197:4000/api/v1/answer/delete
        - HTTP method: DELETE
        - Request Payload: {
            "answerId": <answer_id_in_DB: answer that needs to be deleted: integer>,
            "userId": <user_id_in_DB: user who made the answer: integer>
        }
        - Response payload if successful: {
            statusCode: 200,
            success: true,
            message: "Answer deleted!"
        }
        - Response payload if not successful: {
            statusCode: 400,
            success: false,
            message: <appropriate_error_message>
        }

## Future scope:

    - Addition of jwt token authentication using a middleware such as passport.js,
    - Addition of comments in answer (at the current moment the comment feature is applicable to question only)
    - Usage of UUID for id rather than relying on Integer,
    - Resend OTP if OTP expires (OTP expires in 10 min after receiving it in mail, way around is to signIn where i flip the "status" flag to "active" )
    - Addition of Phone number which can be used for signUp or signIn instead of relying on email and Phone number verification.
    - Not restricting question, comments, answer "body" to 256 char.

## Using it in local system:

    Feel free to use this repo and play with the application to your hearts content.

    - You can git clone the repo and setup the postgres and server on you local machine too.
    
    - to install dependencies use: npm install 
    
    - prerequisite: typescript, node, npm installed in your machine, you also need a running instance of postgres client and create a db on postgres of any name of your choosing. 
    
    - You also need to create a .env file in your application directory at root level with following:
        ENVIRONMENT=LOCAL
        DB_TABLE=<your_DB_name>
        DB_USER=<your_Postgres_User>
        DB_PWD=<your_Postgres_password>
        AUTH_EMAIL=<registered_mailer_address_for_nodemailer>
        AUTH_PASS=<registered_mailer_password_for_nodemailer>
        VERIFICATION_SUBJECT=<any_subject>

    - You also need to run the generateKeyPairs.ts file before running the application,
    Use the following command on command line:
    ts-node src/config/encryptionKey/generateKeyPairs.ts

    - The above command generates 2 Asymmetric key of .pem type that is used in jwt encoding and decoding in the application

    - after you have installed dependencies and setup is completed to run the application run command on your command line:
        npm run dev

    - I am using the following version (if this helps you):
    node --version: 16.15.1
    npm --version: 8.11.0
    postgres --version: 15.3