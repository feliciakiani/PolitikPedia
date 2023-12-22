package com.dicoding.politikpediaxml.view.home.ui.capres

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
import com.dicoding.politikpediaxml.data.Capres
import com.dicoding.politikpediaxml.data.ListCapresAdapter
import com.dicoding.politikpediaxml.databinding.FragmentCapresBinding

class CapresFragment : Fragment() {

    private lateinit var rvCapres: RecyclerView
    private var _binding: FragmentCapresBinding? = null
    private val list = ArrayList<Capres>()

    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val capresViewModel = ViewModelProvider(this).get(CapresViewModel::class.java)

        _binding = FragmentCapresBinding.inflate(inflater, container, false)
        val root: View = binding.root

        rvCapres = binding.rvCapres
        rvCapres.setHasFixedSize(true)

        list.addAll(getListCapres())
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

    private fun getListCapres(): ArrayList<Capres> {
        val dataName = resources.getStringArray(R.array.data_name_capres)
        val dataDescription = resources.getStringArray(R.array.data_capres_description)
        val dataPhoto = resources.obtainTypedArray(R.array.data_photo_capres)
        val listCapres = ArrayList<Capres>()
        for (i in dataName.indices) {
            val capres = Capres(dataName[i], dataDescription[i], dataPhoto.getResourceId(i, -1))
            listCapres.add(capres)
        }
        return listCapres
    }

    private fun showRecyclerList() {
        rvCapres.layoutManager = LinearLayoutManager(requireContext())
        val listCapresAdapter = ListCapresAdapter(list)
        rvCapres.adapter = listCapresAdapter

        listCapresAdapter.setOnItemClickCallback(object : ListCapresAdapter.OnItemClickCallback {
            override fun onItemClicked(data: Capres) {
                showSelectedCapres(data)
            }
        })
    }

    private fun showSelectedCapres(capres: Capres) {
        val intentToDetail = Intent(requireContext(), DetailCapresActivity::class.java)
        intentToDetail.putExtra(DetailCapresActivity.key_capres, capres)
        startActivity(intentToDetail)
    }
}