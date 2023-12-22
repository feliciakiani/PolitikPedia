package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class FavoriteAnggotaPartaiResponse(

	@field:SerializedName("FavoriteAnggotaPartaiResponse")
	val favoriteAnggotaPartaiResponse: List<FavoriteAnggotaPartaiResponseItem?>? = null
)

data class FavoriteAnggotaPartaiResponseItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("Foto")
	val foto: String? = null,

	@field:SerializedName("ID")
	val iD: Int? = null
)
