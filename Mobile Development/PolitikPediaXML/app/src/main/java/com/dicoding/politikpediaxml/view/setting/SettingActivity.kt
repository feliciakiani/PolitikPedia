package com.dicoding.politikpediaxml.view.setting

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.activity.viewModels
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.view.ViewModelFactory
import com.dicoding.politikpediaxml.view.login.LoginViewModel
import com.dicoding.politikpediaxml.view.welcome.WelcomeActivity

class SettingActivity : AppCompatActivity() {

    private val viewModel by viewModels<LoginViewModel> {
        ViewModelFactory.getInstance(this)
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setting)

        findViewById<Button>(R.id.logout).setOnClickListener {
            viewModel.logout()
            Intent(this@SettingActivity, WelcomeActivity::class.java).also {
                startActivity(it)
                finish()
            }
        }
    }
}