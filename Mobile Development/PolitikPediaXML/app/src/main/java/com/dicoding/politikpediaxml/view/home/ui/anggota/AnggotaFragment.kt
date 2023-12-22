package com.dicoding.politikpediaxml.view.home.ui.anggota

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.data.Anggota
import com.dicoding.politikpediaxml.data.ListAnggotaAdapter
import com.dicoding.politikpediaxml.databinding.FragmentAnggotaBinding

class AnggotaFragment : Fragment() {

    private lateinit var rvAnggota: RecyclerView
    private var _binding: FragmentAnggotaBinding? = null
    private val list = ArrayList<Anggota>()

    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val anggotaViewModel = ViewModelProvider(this).get(AnggotaViewModel::class.java)

        _binding = FragmentAnggotaBinding.inflate(inflater, container, false)
        val root: View = binding.root

        rvAnggota = binding.rvAnggota
        rvAnggota.setHasFixedSize(true)

        list.addAll(getListAnggota())
        showRecyclerList()

        return root
    }

//    override fun onOptionsItemSelected(item: MenuItem): Boolean {
//        when (item.itemId) {
//            R.id.setting -> {
//                rvPartai.layoutManager = LinearLayoutManager(this)
//            }
//        }
//        return super.onOptionsItemSelected(item)
//    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun getListAnggota(): ArrayList<Anggota> {
        val dataName = resources.getStringArray(R.array.data_name_anggota)
        val dataDescription = resources.getStringArray(R.array.data_capres_anggota)
        val dataPhoto = resources.obtainTypedArray(R.array.data_photo_anggota)
        val dataPartai = resources.getStringArray(R.array.data_nama_partai_anggota)
        val listAnggota = ArrayList<Anggota>()
        for (i in dataName.indices) {
            val anggota = Anggota(dataName[i], dataDescription[i], dataPhoto.getResourceId(i, -1), dataPartai[i])
            listAnggota.add(anggota)
        }
        return listAnggota
    }

    private fun showRecyclerList() {
        rvAnggota.layoutManager = LinearLayoutManager(requireContext())
        val listAnggotaAdapter = ListAnggotaAdapter(list)
        rvAnggota.adapter = listAnggotaAdapter

        listAnggotaAdapter.setOnItemClickCallback(object : ListAnggotaAdapter.OnItemClickCallback {
            override fun onItemClicked(data: Anggota) {
                showSelectedAnggota(data)
            }
        })
    }

    private fun showSelectedAnggota(anggota: Anggota) {
        val intentToDetail = Intent(requireContext(), DetailAnggotaActivity::class.java)
        intentToDetail.putExtra(DetailAnggotaActivity.key_anggota, anggota)
        startActivity(intentToDetail)
    }
}