#!/usr/bin/env python
# coding: utf-8

# <a href="https://colab.research.google.com/github/feliciakiani/PolitikPedia/blob/main/Machine%20Learning/ETL_Spam.ipynb" target="_parent"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>

# In[ ]:

# In[63]:


import numpy as np
import pandas as pd
# from google.colab import files
# uploaded = files.upload()

import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

import mysql.connector
from textblob import TextBlob
from keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import os

from keras.models import load_model


# In[64]:


def filters(text):
  filters = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n'
  regex_pattern = '[' + re.escape(filters) + ']'

  filtered_text = re.sub(regex_pattern, '', text)

  return filtered_text


factory = StemmerFactory()
stemmer = factory.create_stemmer()

def stemming(text):
    return stemmer.stem(text)

def preprocessedText(text):
  text = filters(text)
  text = stemming(text)

  return text


# 

# In[65]:

# In[66]:


model = load_model("spamDetection.h5")

def spam_detection(user_id):
  # Koneksi ke database Cloud SQL
  conn = mysql.connector.connect(
          host=os.getenv("DB_HOST"),
          user=os.getenv("DB_USERNAME"),
          password=os.getenv("DB_PASSWORD"),
          database=os.getenv("DB_NAME")
  )

  # Buat kursor
  cursor = conn.cursor()

  #-------------------------------------------------spam_Classification-------------------------------------------#
  # Hyperparameter, jangan diganti
  max_words = 34

  query_comments = f"SELECT ID as comment_id, Komentar as komentar_text FROM komentar WHERE IDUser = {user_id} ORDER BY TglKomentar DESC LIMIT 1"
  cursor.execute(query_comments)
  comments = cursor.fetchall()

  if comments:
    for row in comments:
      comment_id, komentar_text = row  # Extracting comment_id and Komentar
      print(f"Comment ID: {comment_id}, Komentar: {komentar_text}")

   # Apply preprocessing
    preprocessed_text = preprocessedText(komentar_text)

    # Tokenize the text data
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=max_words, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=True)
    # tokenizer = Tokenizer(num_words=max_words, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=True)
    
    # Read the content of 'sentences.txt' and split it into lines
    with open('sentences_spam.txt', 'r', encoding='utf-8') as file:
      tokenizer_sentences = file.read().splitlines()
    tokenizer.fit_on_texts(tokenizer_sentences)

    # Tokenize and pad the new text
    new_sequence = tokenizer.texts_to_sequences([preprocessed_text])
    new_padded_sequence = pad_sequences(new_sequence, maxlen=max_words, padding='post')

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

    print(f"User ID: {user_id}, Comment ID: {comment_id}, Predicted Class: {predicted_class} (Confidence: {confidence_str})")

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


# In[67]:


# flask
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/spam_detection/<string:userId>', methods=['GET'])
def spam_detection_endpoint(userId):

    result = spam_detection(userId)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)

