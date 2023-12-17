#!/usr/bin/env python
# coding: utf-8

# <a href="https://colab.research.google.com/github/feliciakiani/PolitikPedia/blob/main/Machine%20Learning/ETL.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# Data preprocessing

# In[3]:


import numpy as np
import pandas as pd
# from google.colab import files
# uploaded = files.upload()

import nltk
from nltk.corpus import stopwords

import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

import mysql.connector
import os
from textblob import TextBlob
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf

# install .env
from dotenv import load_dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), 'Backend', '.env')
load_dotenv(dotenv_path)


# In[4]:


from keras.models import load_model


# In[5]:


# Download the NLTK stop words dataset (if not already downloaded)
nltk.download('stopwords')

# Get the list of Indonesian stop words
stop_words_indonesian = set(stopwords.words('indonesian'))
id_stopword_dict = pd.DataFrame({'stop_word': list(stop_words_indonesian)})

alay_dict = pd.read_csv('../Machine Learning/Data/new_kamusalay.csv', encoding='latin-1', header=None)
alay_dict = alay_dict.rename(columns={0: 'original',
                                      1: 'replacement'})


# In[6]:


factory = StemmerFactory()
stemmer = factory.create_stemmer()


def lowercase(text):
    return text.lower()

def remove_unnecessary_char(text):
    # Remove every '\n'
    text = re.sub(r'\n', ' ', text)

    # Remove every retweet symbol
    text = re.sub(r'rt', ' ', text)

    # Remove every username
    text = re.sub(r'user', ' ', text)

    # Remove every URL
    text = re.sub(r'((www\.[^\s]+)|(https?://[^\s]+)|(http?://[^\s]+))', ' ', text)

    # Remove all emojis (Unicode characters)
    text = re.sub(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F700-\U0001F77F\U0001F780-\U0001F7FF\U0001F800-\U0001F8FF\U0001F900-\U0001F9FF\U0001FA00-\U0001FA6F\U0001FA70-\U0001FAFF\U00002702-\U000027B0\U000024C2-\U0001F251]', ' ', text)

   # Remove all hexadecimal representations of UTF-8 encoded characters
    text = re.sub(r'\\x[0-9a-fA-F]{2}', ' ', text)
    text = re.sub(r'x[0-9a-fA-F]{2}', ' ', text)  # If the 'x' is not escaped

    # Remove extra spaces
    text = re.sub(r'  +', ' ', text)

    return text

def remove_nonaplhanumeric(text):
    text = re.sub('[^0-9a-zA-Z]+', ' ', text)
    return text

alay_dict_map = dict(zip(alay_dict['original'], alay_dict['replacement']))
def normalize_alay(text):
    return ' '.join([alay_dict_map[word] if word in alay_dict_map else word for word in text.split(' ')])

def remove_stopword(text):
    stop_words = set(id_stopword_dict['stop_word'])
    text = ' '.join(['' if word in stop_words else word for word in text.split(' ')])
    text = re.sub('  +', ' ', text)  # Remove extra spaces
    text = text.strip()
    return text

def stemming(text):
    return stemmer.stem(text)

def preprocess(text):
    text = lowercase(text) # 1
    text = remove_nonaplhanumeric(text) # 2
    text = remove_unnecessary_char(text) # 2
    text = normalize_alay(text) # 3
    text = stemming(text) # 4
    text = remove_stopword(text) # 5
    return text


# In[7]:


# Koneksi ke database Cloud SQL
def predict_sentiment(user_id):
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    # Buat kursor
    cursor = conn.cursor()

    # Query data komentar
    query = f"SELECT ID as comment_id, Komentar as komentar_text FROM komentar WHERE IDUser = {user_id} ORDER BY TglKomentar DESC LIMIT 1"
    cursor.execute(query)
    comment = cursor.fetchall()

    #-------------------------------------------------Text_Classification-------------------------------------------#
    #Hyperparameter
    max_length = 56

    # Tokenize the sentences
    tokenizer = tf.keras.preprocessing.text.Tokenizer()
    # Read the content of 'sentences.txt' and split it into lines
    with open('sentences.txt', 'r', encoding='utf-8') as file:
        tokenizer_sentences = file.read().splitlines()
    tokenizer.fit_on_texts(tokenizer_sentences)

    # Load the best-performing model
    model_path = 'Text_Classification.h5'
    model = load_model(model_path)
    # Check if the comment exists
    if comment:
        for row in comment:
            comment_id, komentar_text = row  # Extracting comment_id and Komentar
            print(f"Comment ID: {comment_id}, Komentar: {komentar_text}")

        # Apply preprocessing
        preprocessed_text = preprocess(komentar_text)

        # Tokenize and pad the new text
        new_sequence = tokenizer.texts_to_sequences([preprocessed_text])
        new_padded_sequence = pad_sequences(new_sequence, maxlen=max_length, padding='post')

        # Make predictions
        prediction = model.predict(new_padded_sequence)

        # Extract the scalar value from the NumPy array
        confidence = prediction[0, 0]

        # Threshold for considering a label as positive
        threshold = 0.5

        # Interpret prediction
        predicted_class = 1 if confidence >= threshold else 0

        # Convert confidence to a format that can be handled by format method
        confidence_str = '{:.4f}'.format(confidence)

        # Return the results
        result = {
            "comment_id": comment_id,
            "predicted_class": predicted_class,
            "confidence": confidence_str
        }
    else:
        result = {"error": f"Comment with ID {user_id} not found."}

    # Close the database connection
    cursor.close()
    conn.close()

    return result   


# In[9]:


# flask
from flask import Flask, jsonify, request
import jwt

app = Flask(__name__)

@app.route('/predict_sentiment', methods=['GET'])
def predict_sentiment_endpoint():

    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        # Extract the token from the Authorization header
        auth_token = auth_header.split(' ')[1]

        # Decode the JWT token to access user information
        decoded_token = jwt.decode(auth_token, os.getenv("JWT_SECRET_KEY"), algorithms=['HS256'])

        user_id = decoded_token.get('userId')

        if user_id:
            result = predict_sentiment(user_id)
            return jsonify(result)
        else:
            return jsonify({'error': 'userId not found in token'}), 401
    else:
        return jsonify({'error': 'authToken not provided in the Authorization header'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)

