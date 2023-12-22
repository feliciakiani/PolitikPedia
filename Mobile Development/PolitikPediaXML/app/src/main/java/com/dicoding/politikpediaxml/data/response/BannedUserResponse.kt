package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class BannedUserResponse(

	@field:SerializedName("message")
	val message: String? = null
)
