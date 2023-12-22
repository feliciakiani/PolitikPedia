package com.dicoding.politikpediaxml.data

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.dicoding.politikpediaxml.R

class ListAnggotaAdapter(private val listAnggota: ArrayList<Anggota>)  : RecyclerView.Adapter<ListAnggotaAdapter.ListViewHolder>() {
    private lateinit var onItemClickCallback: OnItemClickCallback

    fun setOnItemClickCallback(onItemClickCallback: OnItemClickCallback) {
        this.onItemClickCallback = onItemClickCallback
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListViewHolder {
        val view: View = LayoutInflater.from(parent.context).inflate(R.layout.item_row_anggota, parent, false)
        return ListViewHolder(view)
    }

    override fun onBindViewHolder(holder: ListViewHolder, position: Int) {
        val (name, description, photo,partai) = listAnggota[position]
        holder.imgPhoto.setImageResource(photo)
        holder.tvName.text = name
        holder.tvPartai.text = partai
        holder.itemView.setOnClickListener {
            Toast.makeText(holder.itemView.context, "Kamu memilih " + listAnggota[holder.adapterPosition].name, Toast.LENGTH_SHORT).show()
            holder.itemView.setOnClickListener { onItemClickCallback.onItemClicked(listAnggota[holder.adapterPosition]) }
        }
    }

    override fun getItemCount(): Int = listAnggota.size

    class ListViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imgPhoto: ImageView = itemView.findViewById(R.id.img_anggota_photo)
        val tvName: TextView = itemView.findViewById(R.id.tv_anggota_name)
        val tvPartai: TextView = itemView.findViewById(R.id.tv_anggota_partai)
    }

    interface OnItemClickCallback {
        fun onItemClicked(data: Anggota)
    }

}