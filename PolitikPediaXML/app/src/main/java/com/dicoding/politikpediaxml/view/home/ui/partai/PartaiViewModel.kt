package com.dicoding.politikpediaxml.view.home.ui.partai

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class PartaiViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is Partai Fragment"
    }
    val text: LiveData<String> = _text
}