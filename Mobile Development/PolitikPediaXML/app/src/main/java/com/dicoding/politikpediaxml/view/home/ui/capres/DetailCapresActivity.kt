package com.dicoding.politikpediaxml.view.home.ui.capres

import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.data.Capres

class DetailCapresActivity : AppCompatActivity() {
    companion object{
        val key_capres ="KEY_CAPRES"
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_capres)
        val nama_capres = findViewById<TextView>(R.id.nama_capres)
        val capres_deskripsi = findViewById<TextView>(R.id.capres_deskripsi)
        val image_View = findViewById<ImageView>(R.id.imageView)

        val dataCapres = if (Build.VERSION.SDK_INT>=33){
            intent.getParcelableExtra<Capres>(key_capres, Capres::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra<Capres>(key_capres)
        }

        if (dataCapres != null) {
            nama_capres.text = dataCapres.name
            capres_deskripsi.text = dataCapres.description
            image_View.setImageResource(dataCapres.photo)
        }
    }
}