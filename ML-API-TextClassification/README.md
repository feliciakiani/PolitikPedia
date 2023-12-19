# API Description
This API is designed exclusively for the Machine Learning model using Flask Framework. It automatically processes comments submitted through PolitikPedia's backend service. The API requires a token parameter to identify the user making the comment. If the sentiment confidence level exceeds 0.9, indicating a very negative sentiment, the comment will be automatically removed.

# API Endpoint
API URL: [Cloud Run Text Classification](https://text-classification-service-ztd22w7ixa-et.a.run.app).

|Endpoint|Menthod|Description|
|----|-----|-------|
|/predict_sentiment|GET|Predicts the sentiment of a user-inserted comment. If confidence is >= 0.9, the comment is flagged for removal.|

# Deployment
**Services:**
1. Cloud Run: deploy containerized applications quickly and scale effortlessly.
3. Cloud SQL: manage relational databases effortlessly on the cloud.

# How to Run Local
1. Clone the repository: `git clone https://github.com/feliciakiani/PolitikPedia.git`.
2. Create a .env file inside PolitikPedia/ML-API-TextClassification with your own data. Refer to .env.example for the required variables and data.
3. Run PolitikPedia/ML-API-TextClassification/ETL.py.
4. Copy the base endpoint URL provided after running ETL.py. Update the flaskServerUrl in PolitikPedia/Backend/handlers/komentar_handler.js on line 55 with this URL.
4. Save the changes and run PolitikPedia/Backend with the instruction from [How to Run Local Backend Service](https://github.com/feliciakiani/PolitikPedia/tree/main/Backend).
