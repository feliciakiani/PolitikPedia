package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class FavoritePartaiResponse(

	@field:SerializedName("FavoritePartaiResponse")
	val favoritePartaiResponse: List<FavoritePartaiResponseItem?>? = null
)

data class FavoritePartaiResponseItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("ID")
	val iD: Int? = null,

	@field:SerializedName("Logo")
	val logo: String? = null
)
