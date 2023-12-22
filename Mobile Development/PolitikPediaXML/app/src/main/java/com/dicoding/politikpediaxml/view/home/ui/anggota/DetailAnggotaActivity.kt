package com.dicoding.politikpediaxml.view.home.ui.anggota

import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.data.Anggota

class DetailAnggotaActivity : AppCompatActivity() {
    companion object{
        val key_anggota ="KEY_ANGGOTA"
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_anggota)
        val nama_anggota = findViewById<TextView>(R.id.nama_anggota)
        val nama_partai = findViewById<TextView>(R.id.tv_anggota_partai)
        val anggota_deskripsi = findViewById<TextView>(R.id.anggota_deskripsi)
        val image_View = findViewById<ImageView>(R.id.imageView)

        val dataAnggota = if (Build.VERSION.SDK_INT>=33){
            intent.getParcelableExtra<Anggota>(key_anggota, Anggota::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra<Anggota>(key_anggota)
        }

        if (dataAnggota != null) {
            nama_anggota.text = dataAnggota.name
            nama_partai.text = dataAnggota.partai
            anggota_deskripsi.text = dataAnggota.description
            image_View.setImageResource(dataAnggota.photo)
        }
    }
}