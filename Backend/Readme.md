# API Description
This API, is implemented with Node.JS and Hapi Framework and it serves as the backbone for PolitikPedia. It is connected with PolitikPedia database that is stored in Cloud SQL. 

# API Endpoint
API URL: [Cloud Run Backend](https://backend-ztd22w7ixa-et.a.run.app).

|Endpoint|Menthod|Description|
|----|-----|-------|
|/register|POST|Users can register for PolitikPedia app|
|/login|POST|Users can login to PolitikPedia|
|/logout|POST|Users can logout from PolitikPedia|
|/user|GET, PUT|Users can retrieve their user info or change their password|
|/user/banned|POST, PUT|Admin can ban a user|
|/anggota_partai|GET|Retrieve all members of political parties or filtered by individual ID or Partai ID|
|/partai|GET|Retrieve all political parties or filtered by party ID|
|/fav_anggota_partai|GET, POST, DELETE|Users can favourite / disfavorite their own choice of political party members|
|/fav_partai|GET, POST, DELETE|Users can favourite / disfavorite their own choice of political parties|
|/komentar|GET, POST|Users can read and insert comments|
|/komentar/like|POST, DELETE|Users can like a comment of other user|
|/komentar/dislike|POST, DELETE|Users can dislike a comment of other user|
|/report_komentar|POST|Users can report other user's comment|

# Security Concern
This backend is built with authentication and authorization. If a user is not logged in, then the endpoint will return `{"error":"User not logged in!"}`. As for banning a user, only admin with a certain email can successfully hit it.

# Login
When a user login, a cookie will be created for 24 hours to remember their auth token, so a user does not need to login again within the remaining time.

# Deployment
**Services:**
1. Cloud Run: deploy containerized applications quickly and scale effortlessly.
2. Cloud Storage: store and retrieve data seamlessly in the cloud.
3. Cloud SQL: manage relational databases effortlessly on the cloud.

# Email Notification
For enhanced user engagement and moderation, PolitikPedia triggers email notifications from politikpedia.capstone@gmail.com for reported comments and user bans, ensuring timely communication and effective management of platform activities.

# How to Run Local
1. Clone the repository.
    ```
    git clone https://github.com/feliciakiani/PolitikPedia.git
    ```
2. Create a .env file inside PolitikPedia/Backend with your own data. Refer to .env.example for the required variables and data.
3. Change to `host: 'localhost',` in PolitikPedia/Backend/server.js on line 17.
4. Open a terminal and navigate to PolitikPedia/Backend.
    ```
    cd PolitikPedia/Backend
    ```
5. Type `npm install`.
6. Type `node server.js`.
7. It will run on http://127.0.0.1:8080 or localhost:8080.