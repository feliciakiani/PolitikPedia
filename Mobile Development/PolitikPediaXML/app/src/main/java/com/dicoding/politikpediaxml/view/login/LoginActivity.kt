package com.dicoding.politikpediaxml.view.login

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.politikpediaxml.data.pref.UserModel
import com.dicoding.politikpediaxml.databinding.ActivityLoginBinding
import com.dicoding.politikpediaxml.view.ResultState
import com.dicoding.politikpediaxml.view.ViewModelFactory
import com.dicoding.politikpediaxml.view.home.HomeActivity

class LoginActivity : AppCompatActivity() {

    private val viewModel by viewModels<LoginViewModel> {
        ViewModelFactory.getInstance(this)
    }
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupView()
        setupAction()

        binding.loginButton.setOnClickListener {

            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()
//            viewModel.postLogin(email, password)

            viewModel.postLogin(email, password).observe(this) { result ->
                if (result != null) {
                    when(result) {
                        is ResultState.Loading -> {
                            binding.progressBar.visibility = View.VISIBLE
                        }
                        is ResultState.Success -> {
                            binding.progressBar.visibility = View.GONE

                            if (result.data.equals("Login success")) {
                                Intent(this@LoginActivity, HomeActivity::class.java).also {
                                    viewModel.saveSession(UserModel("email@mail.com", "123456789", true))
                                    startActivity(it)
                                }
                            } else if (result.data?.equals("Invalid") == true){
                                Toast.makeText(this@LoginActivity, "Password/Email Salah", Toast.LENGTH_SHORT).show()
                            }
                        }
                        is ResultState.Error -> {
                            binding.progressBar.visibility = View.GONE
                            Toast.makeText(this@LoginActivity, "Login Gagal", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }

        }
    }

    private fun setupView() {
        @Suppress("DEPRECATION")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.hide(WindowInsets.Type.statusBars())
        } else {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN
            )
        }
        supportActionBar?.hide()
    }

    private fun setupAction() {
        binding.loginButton.setOnClickListener {
            Log.d("Login Button","button ditekan")
            val email = binding.emailEditText.text.toString()
            viewModel.saveSession(UserModel(email, "sample_token"))
            AlertDialog.Builder(this).apply {
                setTitle("Yeah!")
                setMessage("Anda berhasil login.")
                setPositiveButton("Lanjut") { _, _ ->
                    val intent = Intent(context, HomeActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
                    startActivity(intent)
                    finish()
                }
                create()
                show()
            }
        }
    }

}