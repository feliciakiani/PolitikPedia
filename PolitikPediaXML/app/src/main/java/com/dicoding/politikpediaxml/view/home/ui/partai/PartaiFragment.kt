package com.dicoding.politikpediaxml.view.home.ui.partai

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.dicoding.politikpediaxml.R
import com.dicoding.politikpediaxml.data.ListPartaiAdapter
import com.dicoding.politikpediaxml.data.Partai
import com.dicoding.politikpediaxml.databinding.FragmentPartaiBinding

class PartaiFragment : Fragment() {

    private lateinit var rvPartai: RecyclerView
    private var _binding: FragmentPartaiBinding? = null
    private val list = ArrayList<Partai>()

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val partaiViewModel = ViewModelProvider(this).get(PartaiViewModel::class.java)

        _binding = FragmentPartaiBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Inisialisasi rvPartai menggunakan binding
        rvPartai = binding.rvPartai
        rvPartai.setHasFixedSize(true)

        list.addAll(getListPartai())
        showRecyclerList()

        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun getListPartai(): ArrayList<Partai> {
        val dataName = resources.getStringArray(R.array.data_name)
        val dataDescription = resources.getStringArray(R.array.data_description)
        val dataPhoto = resources.obtainTypedArray(R.array.data_photo)
        val listHero = ArrayList<Partai>()
        for (i in dataName.indices) {
            val hero = Partai(dataName[i], dataDescription[i], dataPhoto.getResourceId(i, -1))
            listHero.add(hero)
        }
        return listHero
    }

    private fun showRecyclerList() {
        // Pastikan rvPartai sudah diinisialisasi sebelum digunakan
        rvPartai.layoutManager = LinearLayoutManager(requireContext())
        val listHeroAdapter = ListPartaiAdapter(list)
        rvPartai.adapter = listHeroAdapter
    }
}