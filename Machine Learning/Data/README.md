# Data 

## Table of contents
- [id-multi-label-hate-speech-and-abusive-language-detection](#id-multi-label-hate-speech-and-abusive-language-detection)
- [Dataset-keywords](#Dataset-keywords)
- [Dataset-semantic](#Dataset-semantic)
- [Dataset-sentences](#Dataset-Spam)

## id-multi-label-hate-speech-and-abusive-language-detection
Here we provide our dataset for multi-label hate speech and abusive language detection in the Indonesian Twitter. The main dataset can be seen at **re_dataset** with labels information as follows:
* **HS** : hate speech label;
* **Abusive** : abusive language label;
* **HS_Individual** : hate speech targeted to an individual;
* **HS_Group** : hate speech targeted to a group;
* **HS_Religion** : hate speech related to religion/creed;
* **HS_Race** : hate speech related to race/ethnicity;
* **HS_Physical** : hate speech related to physical/disability;
* **HS_Gender** : hate speech related to gender/sexual orientation;
* **HS_Gender** : hate related to other invective/slander;
* **HS_Weak** : weak hate speech;
* **HS_Moderate** : moderate hate speech;
* **HS_Strong** : strong hate speech.

For each label, `1` means `yes` (tweets including that label), `0` mean `no` (tweets are not included in that label). 

Due to the Twitter's Terms of Service, we do not provide the tweet ID. All username and URL in this dataset are changed into USER and URL. 

For text normalization in our experiment, we built typo and slang words dictionaries named **new_kamusalay.csv**, that contain two columns (first columns are the typo and slang words, and the second one is the formal words). Here the examples of mapping:
* *beud --> banget*
* *jgn --> jangan*
* *loe --> kamu*

Furthermore, we also built abusive lexicon list named **abusive.csv** that can be used for feature extraction.

## More detail
There are three data in id-multi-label-hate-speech-and-abusive-language-detection. abusive.csv, data.csv, and new_kamusalay.csv are examples of CSV files. as stated in the preceding description. You can attempt to preprocess the data on your own. We've included the code, which is called data_preprocessing.ipynb.

utilize preprocessed_indonesian_toxic_tweet_fixed.csv files for text_classification if you want to utilize the finished dataset that has already been preprocessed using regex, stemmer, and stopwords.


## License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

## Dataset-keywords
Here our team provide dataset that are multi labeled for keywords detection language. The data set contain information as follows :

* **text** : Indonesian Sentences;
* **Kata_kunci** : label that are related to the text;

for each text has been labeled to corresponding keywords, for example `Pemerintahan melakukan pembicaraan untuk memulihkan hubungan internasional.` and there are multi labels labeled to the text `Pemerintahan, melakukan, pembicaraan`

## More detail
The dataset is entirely in Indonesian and pertains to the issue of politics. The labels are also balanced between non-political and political themes. This dataset was created and preprocessed by our capstone team, and we sincerely apologize for any errors because the dataset's restrictions are difficult on this one, especially in the indonesian language and politics topic.

## Dataset-semantic
Here our team provide dataset that are labeled for semantic search. The data set contain information as follows :

* **ID** : the example user id that generated the question;
* **Pertanyaan** : Question that are written by the user;
* **Pencarian** : the intent of the user;

for each question has been labeled to corresponding intent, for example `Bagaimana sistem pemilu di Indonesia?` and there is labels labeled to the text `Partai Politik`

## More detail
The dataset is entirely in Indonesian and pertains to the issue of politics. In addition, the intent labels are not balanced between non-political and political themes, therefore expect to be slanted toward the politics theme. This dataset was created and preprocessed by our capstone team, and we sincerely apologize for any errors because the dataset's restrictions are difficult on this one, especially in the indonesian language and politics topic.

## Dataset-Spam
Here our team provide dataset that are binary labeled for spam detection. The data set contain information as follows :

* **Teks** : Indonesian spam Sentences;
* **label** : label that are classified as spam;

For each text, relevant labels have been assigned, such as 'Maaf, pesan Anda belum terkirim. Please return in a few days. Terimakasih' and the label '1' indicate that the text is spam, whereas the label '0' indicates that the material is not spam.

## More detail
The dataset is entirely in Indonesian and commonly SMS spam. The labels are very balanced, but the limitations are that it solely contains SMS spam text. This dataset was created and preprocessed by our capstone team, and we sincerely apologize for any errors.
