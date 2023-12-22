package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class GetCommentResponse(

	@field:SerializedName("GetCommentResponse")
	val getCommentResponse: List<GetCommentResponseItem?>? = null
)

data class GetCommentResponseItem(

	@field:SerializedName("IDKomentar")
	val iDKomentar: Int? = null,

	@field:SerializedName("TimeDiff")
	val timeDiff: String? = null,

	@field:SerializedName("Like")
	val like: Int? = null,

	@field:SerializedName("FirstName")
	val firstName: String? = null,

	@field:SerializedName("IDAnggotaPartai")
	val iDAnggotaPartai: Int? = null,

	@field:SerializedName("LastName")
	val lastName: String? = null,

	@field:SerializedName("Komentar")
	val komentar: String? = null,

	@field:SerializedName("IDUser")
	val iDUser: Int? = null,

	@field:SerializedName("Dislike")
	val dislike: Int? = null
)
