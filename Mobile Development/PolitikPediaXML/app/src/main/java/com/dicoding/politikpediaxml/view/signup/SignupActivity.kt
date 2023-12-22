package com.dicoding.politikpediaxml.view.signup

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
import com.dicoding.politikpediaxml.button.CustomButton
import com.dicoding.politikpediaxml.databinding.ActivitySignupBinding
import com.dicoding.politikpediaxml.view.ResultState
import com.dicoding.politikpediaxml.view.ViewModelFactory
import com.dicoding.politikpediaxml.view.login.LoginViewModel

class SignupActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding
    private lateinit var myButton: CustomButton

    private val viewModel by viewModels<SignupViewModel> {
        ViewModelFactory.getInstance(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupView()
        setupAction()

        binding.signupButton.setOnClickListener {
            doRegister()
        }

    }

    private fun doRegister() {
        val firstName = binding.nameEditText.text.toString()
        val lastName = binding.lastnameEditText.text.toString()
        val email = binding.emailEditText.text.toString()
        val password = binding.passwordEditText.text.toString()
        viewModel.userRegister(firstName, lastName, email, password).observe(this) { result ->
            if (result != null) {
                when(result) {
                    is ResultState.Loading -> {
                        binding.progressBar2.visibility = View.VISIBLE
                    }
                    is ResultState.Success -> {
                        binding.progressBar2.visibility = View.GONE
                        if (result.data.message?.equals("Register success") == true) {
                            Toast.makeText(this@SignupActivity, result.data.message, Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(this@SignupActivity, result.data.error, Toast.LENGTH_SHORT).show()
                        }
                    }
                    is ResultState.Error -> {
                        binding.progressBar2.visibility = View.GONE
                        Toast.makeText(this@SignupActivity, "login error", Toast.LENGTH_SHORT).show()
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
        binding.signupButton.setOnClickListener {
            Log.d("Register","register ditekan")
            val email = binding.emailEditText.text.toString()
            AlertDialog.Builder(this).apply {
                setTitle("Yeah!")
                setMessage("Akun dengan $email sudah jadi nih. Silahkan login.")
                setPositiveButton("Lanjut") { _, _ ->
                    finish()
                }
                create()
                show()
            }
        }
    }
}