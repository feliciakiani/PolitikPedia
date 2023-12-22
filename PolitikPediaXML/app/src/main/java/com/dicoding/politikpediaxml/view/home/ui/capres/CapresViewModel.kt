package com.dicoding.politikpediaxml.view.home.ui.capres

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class CapresViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is Capres Fragment"
    }
    val text: LiveData<String> = _text
}