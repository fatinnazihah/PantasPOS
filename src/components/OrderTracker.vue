<template>
  <div
    class="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative animate-slide-up"
  >
    <button
      @click="$emit('close')"
      class="absolute top-6 right-6 w-8 h-8 bg-slate-100 rounded-full text-slate-500 font-bold hover:bg-slate-200 transition"
    >
      ✕
    </button>

    <div class="text-center mb-6">
      <div class="text-4xl mb-2">🔍</div>
      <h2 class="font-['Playfair_Display'] text-2xl font-bold text-[#800020]">
        Track Your Order
      </h2>
      <p class="text-slate-400 text-sm font-bold">
        Enter your Daily Queue Number
      </p>
    </div>

    <div class="flex gap-2 mb-8">
      <input
        v-model="searchQ"
        type="number"
        placeholder="#"
        class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-center text-2xl text-slate-700 placeholder:text-slate-300"
        @keyup.enter="checkStatus"
      />
      <button
        @click="checkStatus"
        class="bg-[#800020] text-white px-6 rounded-2xl font-bold shadow-lg shadow-rose-200 active:scale-95 transition"
      >
        Go
      </button>
    </div>

    <div
      v-if="orderResult"
      class="text-center bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200"
    >
      <div
        class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2"
      >
        Status
      </div>

      <div
        class="inline-block px-6 py-2 rounded-full text-lg font-black mb-4 border"
        :class="{
          'bg-yellow-50 text-yellow-600 border-yellow-200':
            orderResult.status === 'pending',
          'bg-blue-50 text-blue-600 border-blue-200':
            orderResult.status === 'preparing',
          'bg-green-50 text-green-600 border-green-200':
            orderResult.status === 'ready',
          'bg-slate-100 text-slate-500 border-slate-200':
            orderResult.status === 'completed',
        }"
      >
        {{ orderResult.status.toUpperCase() }}
      </div>

      <div class="text-slate-600 font-bold">
        <span v-if="orderResult.status === 'pending'"
          >We've received it! Sit tight.</span
        >
        <span v-if="orderResult.status === 'preparing'"
          >Chef is cooking... 🍳</span
        >
        <span v-if="orderResult.status === 'ready'">Pickup at counter! 🥡</span>
        <span v-if="orderResult.status === 'completed'">Picked up. Enjoy!</span>
      </div>
    </div>

    <div
      v-else-if="hasSearched"
      class="text-center text-red-400 font-bold text-sm mt-4"
    >
      Order #{{ searchQ }} not found for today.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const searchQ = ref("");
const orderResult = ref(null);
const hasSearched = ref(false);

const checkStatus = async () => {
  if (!searchQ.value) return;

  hasSearched.value = false;
  orderResult.value = null;
  const todayStr = new Date().toISOString().split("T")[0];

  try {
    const q = query(
      collection(db, "orders"),
      where("queueNumber", "==", parseInt(searchQ.value)),
      where("orderDate", "==", todayStr),
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) orderResult.value = snapshot.docs[0].data();
  } catch (e) {
    console.error("Tracking Error", e);
  } finally {
    hasSearched.value = true;
  }
};
</script>
