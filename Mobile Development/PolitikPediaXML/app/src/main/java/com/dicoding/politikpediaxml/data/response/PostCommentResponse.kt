package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class PostCommentResponse(

	@field:SerializedName("confidence_sentiment")
	val confidenceSentiment: String? = null,

	@field:SerializedName("comment")
	val comment: String? = null,

	@field:SerializedName("message")
	val message: String? = null,

	@field:SerializedName("comment_id")
	val commentId: Int? = null,

	@field:SerializedName("predicted_class_spam")
	val predictedClassSpam: Int? = null
)
