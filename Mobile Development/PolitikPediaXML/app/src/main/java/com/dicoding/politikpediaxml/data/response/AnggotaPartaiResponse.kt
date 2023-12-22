package com.dicoding.politikpediaxml.data.response

import com.google.gson.annotations.SerializedName

data class AnggotaPartaiResponse(

	@field:SerializedName("AnggotaPartaiResponse")
	val anggotaPartaiResponse: List<AnggotaPartaiResponseItem?>? = null
)

data class RiwayatOrganisasiItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("TahunMulai")
	val tahunMulai: Int? = null,

	@field:SerializedName("Jabatan")
	val jabatan: String? = null,

	@field:SerializedName("TahunSelesai")
	val tahunSelesai: Int? = null
)

data class KaryaItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("Tahun")
	val tahun: Int? = null
)

data class RiwayatPendidikanItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("TahunSelesai")
	val tahunSelesai: Int? = null,

	@field:SerializedName("TahunMulai")
	val tahunMulai: Int? = null
)

data class RiwayatPekerjaanItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("TahunSelesai")
	val tahunSelesai: Int? = null,

	@field:SerializedName("TahunMulai")
	val tahunMulai: Int? = null
)

data class AnggotaPartaiResponseItem(

	@field:SerializedName("Nama")
	val nama: String? = null,

	@field:SerializedName("TempatLahir")
	val tempatLahir: String? = null,

	@field:SerializedName("Favorit")
	val favorit: Int? = null,

	@field:SerializedName("Foto")
	val foto: String? = null,

	@field:SerializedName("Penghargaan")
	val penghargaan: List<Any?>? = null,

	@field:SerializedName("RiwayatPendidikan")
	val riwayatPendidikan: List<RiwayatPendidikanItem?>? = null,

	@field:SerializedName("RiwayatOrganisasi")
	val riwayatOrganisasi: List<RiwayatOrganisasiItem?>? = null,

	@field:SerializedName("Karya")
	val karya: List<KaryaItem?>? = null,

	@field:SerializedName("ID")
	val iD: Int? = null,

	@field:SerializedName("IDPartai")
	val iDPartai: Int? = null,

	@field:SerializedName("RiwayatPekerjaan")
	val riwayatPekerjaan: List<RiwayatPekerjaanItem?>? = null,

	@field:SerializedName("TglLahir")
	val tglLahir: String? = null
)
