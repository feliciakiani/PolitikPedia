package com.dicoding.politikpediaxml.view.home.ui.partai

import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.data.Partai

class DetailPartaiActivity : AppCompatActivity() {
    companion object{
        val key_partai ="KEY_PARTAI"
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_partai)
        val nama_partai = findViewById<TextView>(R.id.nama_partai)
        val tv_deskripsi = findViewById<TextView>(R.id.partai_deskripsi)
        val image_View = findViewById<ImageView>(R.id.imageView)

        val dataPartai = if (Build.VERSION.SDK_INT>=33){
            intent.getParcelableExtra<Partai>(key_partai, Partai::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra<Partai>(key_partai)
        }

        if (dataPartai != null) {
            nama_partai.text = dataPartai.name
            tv_deskripsi.text = dataPartai.description
            image_View.setImageResource(dataPartai.photo)
        }
    }
}