package com.dicoding.politikpediaxml.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Anggota(
    val name: String,
    val description: String,
    val photo: Int,
    val partai: String
) : Parcelable