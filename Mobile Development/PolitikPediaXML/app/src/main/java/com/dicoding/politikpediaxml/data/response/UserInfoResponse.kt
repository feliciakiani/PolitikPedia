package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class UserInfoResponse(

	@field:SerializedName("Email")
	val email: String? = null,

	@field:SerializedName("First Name")
	val firstName: String? = null,

	@field:SerializedName("ID")
	val iD: Int? = null,

	@field:SerializedName("Last Name")
	val lastName: String? = null
)
