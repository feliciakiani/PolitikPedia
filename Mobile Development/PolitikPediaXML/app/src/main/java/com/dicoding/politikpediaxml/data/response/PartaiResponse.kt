package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class PartaiResponse(

	@field:SerializedName("PartaiResponse")
	val partaiResponse: List<PartaiResponseItem?>? = null
)

data class Kursi(

	@field:SerializedName("DPRD1")
	val dPRD1: Int? = null,

	@field:SerializedName("DPR")
	val dPR: Int? = null,

	@field:SerializedName("DPRD2")
	val dPRD2: Int? = null
)

data class PartaiResponseItem(

	@field:SerializedName("Visi")
	val visi: List<String?>? = null,

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("Favorit")
	val favorit: Int? = null,

	@field:SerializedName("Ideologi")
	val ideologi: String? = null,

	@field:SerializedName("Kursi")
	val kursi: Kursi? = null,

	@field:SerializedName("KetuaUmum")
	val ketuaUmum: String? = null,

	@field:SerializedName("KetuaFraksiDPR")
	val ketuaFraksiDPR: String? = null,

	@field:SerializedName("Logo")
	val logo: String? = null,

	@field:SerializedName("TglDibentuk")
	val tglDibentuk: String? = null,

	@field:SerializedName("Misi")
	val misi: List<String?>? = null,

	@field:SerializedName("SekretarisJenderal")
	val sekretarisJenderal: String? = null,

	@field:SerializedName("ID")
	val iD: Int? = null,

	@field:SerializedName("KantorPusat")
	val kantorPusat: String? = null,

	@field:SerializedName("Akronim")
	val akronim: String? = null
)
