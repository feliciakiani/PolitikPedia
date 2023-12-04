package com.dicoding.politikpediaxml.di

import android.content.Context
import com.dicoding.politikpediaxml.data.UserRepository
import com.dicoding.politikpediaxml.data.pref.UserPreference
import com.dicoding.politikpediaxml.data.pref.dataStore

object Injection {
    fun provideRepository(context: Context): UserRepository {
        val pref = UserPreference.getInstance(context.dataStore)
        return UserRepository.getInstance(pref)
    }
}