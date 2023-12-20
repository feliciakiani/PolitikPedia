# Machine Learning

This project has 4 machine learning models. Text classification, semantic search, keyword recommendataion, and spam classification. we are building the model using tensorflow and keras library. 

|Models|Output|Description|
|----|-----|-------|
|Text_Classification|binary with confidence score|Predicts the sentimen of a indonesian text. If confidence is >= 0.5, the text is considered as negative.|
|Spam_Classification|binary with confidence score|Predicts the spam of a indonesian text. If confidence is >= 0.5, the text is considered as spam.|
|semantic search|text similarity|predicts the user intent in search engine|
|Keyword recommendation|text similarity|Predicts the keyword that user passed in the text format|

#Text Classification

## Table of Contents

- [Project_Features](#project_features)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Project_Features
- Complete Data preprocessing for any indonesian text dataset that removed unecessary character, using stemming, and using stopwords
- Various Indonesian text Dataset especially politics
- 4 models and some additional models that are ready
- text_classification_V2 features Sentimen analysis that predicts various sentimen indonesian words. the code are using manual embedding or pretrained embedding also RNN or CNN deep learning model and you can choose between one of them. it has also 3 additional unsupervised machine learning model in the end that has each own features
- Spam_Detection features prediction of text spam of indonesian words. We are using a simple manual embedding and DNN deep learning model.
- Semantic_search features predict the intended text passed by user. it is commonly used in search engine. We are using cosine similarity metrics to see the similarity words in each text.
- Keywords recommendation predict keyword that are passed by users to enchance content searching in the database. We are using cosine similarity metrics to see the similarity words in each text.

## Installation

- after clonning the git, run one of the models ipynb files
- in the code most of the model are using inference of personal google drive make sure to change the google drive or change it to your own path
- for text_classification use the avaible preprocessed_indonesian_toxic_tweet.csv in the data directory. run each of the cell code.
- for spam_detection use the augmented_spam_dataset.csv. run each of the cell code.
- for semantic_search use the dataset_semantic.csv. run each of the cell code
- for keywords_recommendation use the dataset_keywords.csv. run each of the cell code
### Prerequisites

- Python 3
- Jupyter Notebook

### Clone the Repository

```bash
git clone https://github.com/feliciakiani/PolitikPedia.git.
cd Machine Learning
pip install -r requirements.txt



Replace the placeholder text like `[![Build Status](your_build_status_badge)](link_to_build_status)` with actual URLs or content specific to your project. Feel free to add or modify sections according to your project's needs.

Once you've customized the template, save it as README.md in your project's root directory and push the changes to your GitHub repository.
