# API Description
This API is designed exclusively for the Machine Learning model using Flask Framework. It automatically processes comments submitted through PolitikPedia's backend service. The API requires a user ID parameter to identify the user making the comment. The ML model predicts whether a comment is spam or not. If the predicted class equals 1, indicating spam, the comment is automatically flagged for removal.

# API Endpoint
API URL: [Cloud Run Spam Detection](https://spam-detection-service-ztd22w7ixa-et.a.run.app).

|Endpoint|Menthod|Description|
|----|-----|-------|
|/spam_detection|GET|Predicts the spam status of a user's comment based on the provided user ID. If predicted as spam (predicted_class = 1), the comment is flagged for removal.|

# Deployment
**Services:**
1. Cloud Run: deploy containerized applications quickly and scale effortlessly.
3. Cloud SQL: manage relational databases effortlessly on the cloud.

# How to Run Local
1. Clone the repository: `git clone https://github.com/feliciakiani/PolitikPedia.git`.
2. Create a .env file inside PolitikPedia/ML-API-SpamDetection with your own data. Refer to .env.example for the required variables and data.
3. Run PolitikPedia/ML-API-SpamDetection/ETL.py.
4. Copy the base endpoint URL provided after running ETL.py. Update the flaskServerUrl in PolitikPedia/Backend/handlers/komentar_handler.js on line 55 with this URL.
4. Save the changes and run PolitikPedia/Backend with the instruction from [How to Run Local Backend Service](https://github.com/feliciakiani/PolitikPedia/tree/main/Backend).