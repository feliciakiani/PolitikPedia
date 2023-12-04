package com.dicoding.politikpediaxml.view.home.ui.anggota

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.dicoding.politikpediaxml.databinding.FragmentAnggotaBinding

class AnggotaFragment : Fragment() {

    private var _binding: FragmentAnggotaBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val anggotaViewModel =
            ViewModelProvider(this).get(AnggotaViewModel::class.java)

        _binding = FragmentAnggotaBinding.inflate(inflater, container, false)
        val root: View = binding.root



        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}