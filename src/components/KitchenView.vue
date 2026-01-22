<template>
  <div
    class="min-h-screen relative overflow-hidden font-sans text-slate-700 selection:bg-rose-200 p-6"
  >
    <div
      class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[#FEF9C3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10"
    ></div>
    <div
      class="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-[#DBEAFE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10"
    ></div>

    <header
      class="flex justify-between items-end mb-8 pb-4 border-b border-[#800020]/10 relative z-10"
    >
      <div>
        <h1
          class="text-4xl font-['Playfair_Display'] font-black text-[#800020] tracking-wide"
        >
          KITCHEN DISPLAY
        </h1>
        <p
          class="text-xs text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold"
        >
          Live Orders
        </p>
      </div>
      <div class="flex flex-col items-end">
        <span
          class="text-3xl font-black text-slate-800 font-mono tracking-tighter"
          >{{ currentTime }}</span
        >
        <span
          class="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md uppercase tracking-wider mt-1"
          >System Online</span
        >
      </div>
    </header>

    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center h-[60vh] opacity-40"
    >
      <div class="text-8xl mb-4 grayscale">🍳</div>
      <div class="text-3xl font-bold font-['Playfair_Display'] text-[#800020]">
        All Clear, Chef!
      </div>
      <p class="text-slate-500 font-bold mt-2">Waiting for new orders...</p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
    >
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white/90 backdrop-blur-sm rounded-[2rem] overflow-hidden flex flex-col shadow-xl border-2 border-white hover:-translate-y-1 transition-all duration-300 animate-slide-up"
      >
        <div
          class="p-5 bg-slate-50 flex justify-between items-start border-b border-slate-100"
        >
          <div>
            <span
              class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5"
              >Queue Number</span
            >
            <span
              class="font-mono text-4xl font-black text-[#800020] tracking-widest"
            >
              #{{ order.queueNumber }}
            </span>
            <div class="mt-1 flex items-center gap-1">
              <span class="text-[9px] text-slate-400 uppercase font-bold"
                >ID:</span
              >
              <span class="font-mono text-[10px] text-slate-500">{{
                order.id.slice(0, 6).toUpperCase()
              }}</span>
            </div>
          </div>
          <div class="text-right">
            <span
              class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5"
              >Date & Time</span
            >
            <div
              class="flex flex-col items-end text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg"
            >
              <span>{{ order.orderDate }}</span>
              <span class="text-xs text-slate-500">{{
                formatTime(order.timestamp)
              }}</span>
            </div>
          </div>
        </div>

        <div class="p-6 flex-1 bg-white">
          <ul class="space-y-4">
            <li
              v-for="(item, idx) in order.items"
              :key="idx"
              class="flex items-start gap-3 group"
            >
              <div
                class="mt-1.5 w-4 h-4 rounded-full border-2 border-[#800020] flex items-center justify-center shrink-0"
              >
                <div
                  class="w-2 h-2 bg-[#800020] rounded-full opacity-0 group-hover:opacity-100 transition"
                ></div>
              </div>
              <span
                class="text-lg font-bold text-slate-700 leading-tight group-hover:text-[#800020] transition"
              >
                {{ item.name }}
              </span>
            </li>
          </ul>
        </div>

        <div class="p-4 bg-white border-t border-slate-50">
          <button
            @click="markReady(order.id)"
            class="w-full py-4 bg-[#800020] hover:bg-[#600015] text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-lg shadow-rose-200 hover:shadow-rose-300 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Mark Ready</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const orders = ref([]);
const currentTime = ref("");

onMounted(() => {
  // Clock
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, 1000);

  // Real-time listener for Pending Orders
  const q = query(
    collection(db, "orders"),
    where("status", "==", "pending"),
    orderBy("timestamp", "asc"),
  );

  onSnapshot(q, (snapshot) => {
    orders.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  });
});

const markReady = async (id) => {
  if (confirm("Is this order packed and ready?")) {
    // Sets status to 'ready' so it disappears from here but shows on Customer Tracker
    await updateDoc(doc(db, "orders", id), { status: "ready" });
  }
};

const formatTime = (ts) => {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
}
</style>
