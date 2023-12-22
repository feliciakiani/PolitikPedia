package com.dicoding.politikpediaxml.view.signup

import androidx.lifecycle.ViewModel
import com.dicoding.politikpediaxml.data.UserRepository

class SignupViewModel(private val repository: UserRepository) : ViewModel() {

    fun userRegister(email: String, password: String, firstName: String, lastName: String) =
        repository.userRegister(email, password, firstName, lastName)

}