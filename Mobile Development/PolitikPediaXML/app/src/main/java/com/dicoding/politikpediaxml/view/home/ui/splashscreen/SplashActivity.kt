package com.dicoding.politikpediaxml.view.home.ui.splashscreen

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.view.ViewModelFactory
import com.dicoding.politikpediaxml.view.home.HomeActivity
import com.dicoding.politikpediaxml.view.login.LoginViewModel
import com.dicoding.politikpediaxml.view.welcome.WelcomeActivity

class SplashActivity : AppCompatActivity() {

    private val viewModel by viewModels<LoginViewModel> {
        ViewModelFactory.getInstance(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Start the main activity after a delay
        Handler().postDelayed({

            viewModel.getSession().observe(this) { user ->
                if (!user.isLogin) {
                    startActivity(Intent(this, WelcomeActivity::class.java))
                    finish()
                } else {
                    startActivity(Intent(this, HomeActivity::class.java))
                    finish()
                }
            }
        }, 2000)




    }
}