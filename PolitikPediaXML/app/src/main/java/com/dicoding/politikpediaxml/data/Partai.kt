package com.dicoding.politikpediaxml.data

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Partai(
    val name: String,
    val description: String,
    val photo: Int
) : Parcelable