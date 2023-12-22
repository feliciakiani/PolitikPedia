package com.dicoding.politikpediaxml.view.home.ui.anggota

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class AnggotaViewModel : ViewModel() {

    private val _text = MutableLiveData<String>().apply {
        value = "This is Anggota Fragment"
    }
    val text: LiveData<String> = _text
}