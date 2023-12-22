package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class LoginResponse(
	@field:SerializedName("error")
	val error: String? = null,

	@field:SerializedName("message")
	val message: String? = null
)
//{"error":"Invalid email!"}