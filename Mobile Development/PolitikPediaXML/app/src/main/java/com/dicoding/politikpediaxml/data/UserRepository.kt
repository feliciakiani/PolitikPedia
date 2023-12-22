package com.dicoding.politikpediaxml.data

import android.util.Log
import androidx.lifecycle.liveData
import com.dicoding.politikpediaxml.data.pref.UserModel
import com.dicoding.politikpediaxml.data.pref.UserPreference
import com.dicoding.politikpediaxml.data.response.LoginResponse
import com.dicoding.politikpediaxml.data.response.RegisterResponse
import com.dicoding.politikpediaxml.data.retrofit.ApiService
import com.dicoding.politikpediaxml.view.ResultState
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import retrofit2.HttpException

class UserRepository private constructor(
    private val userPreference: UserPreference,
    private val apiService: ApiService
) {

    suspend fun saveSession(user: UserModel) {
        userPreference.saveSession(user)
    }

    fun getSession(): Flow<UserModel> {
        return userPreference.getSession()
    }

    suspend fun logout() {
        userPreference.logout()
    }

    fun userLogin(email: String, password: String) = liveData {
        emit(ResultState.Loading)
        try {
            val message = apiService.login(email, password)
            emit(ResultState.Success(message.message))
            Log.d("Login", "Login telah berhasil $email, $password")
        } catch (e: HttpException) {
            val jsonInString = e.response()?.errorBody()?.string()
            val errorBody = Gson().fromJson(jsonInString, LoginResponse::class.java)
            val errorMessage = errorBody.error
            emit(errorMessage?.let { ResultState.Error(it) })
            Log.d("Login", "Login telah gagal $email, $password, $errorMessage")
        }
    }

    fun userRegister(email: String, password: String, firstName: String, lastName: String) = liveData {
        emit(ResultState.Loading)
        try {
            val message = apiService.register(email, password, firstName, lastName)
            emit(ResultState.Success(message))
        } catch (e: HttpException) {
            val jsonInString = e.response()?.errorBody()?.string()
            val errorBody = Gson().fromJson(jsonInString, RegisterResponse::class.java)
            val errorMessage = errorBody.error
            emit(errorMessage?.let { ResultState.Error(it) })
//            Log.d(
//                "Register",
//                "Register telah gagal $name, $email, $password, ${e.message} dan $errorMessage"
//            )
        }
    }

    companion object {
        @Volatile
        private var instance: UserRepository? = null
        fun getInstance(
            userPreference: UserPreference,
            apiService: ApiService
        ): UserRepository =
            instance ?: synchronized(this) {
                instance ?: UserRepository(userPreference, apiService)
            }.also { instance = it }
    }
}