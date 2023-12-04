package com.dicoding.politikpediaxml.view.home.ui.capres

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.dicoding.politikpediaxml.databinding.FragmentCapresBinding

class CapresFragment : Fragment() {

    private var _binding: FragmentCapresBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val capresViewModel =
            ViewModelProvider(this).get(CapresViewModel::class.java)

        _binding = FragmentCapresBinding.inflate(inflater, container, false)
        val root: View = binding.root


        return root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}