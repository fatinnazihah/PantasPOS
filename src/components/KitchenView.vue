<template>
  <div
    class="min-h-screen relative overflow-hidden font-sans text-slate-700 selection:bg-rose-200 p-6 md:p-10"
  >
    <div
      class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[#FEF9C3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10"
    ></div>
    <div
      class="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-[#DBEAFE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10"
    ></div>

    <header
      class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-[#800020]/10 relative z-10 gap-4"
    >
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1
            class="text-4xl md:text-5xl font-['Playfair_Display'] font-black text-[#800020] tracking-tight"
          >
            KITCHEN
          </h1>
          <span
            class="bg-[#800020] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest"
            >Display</span
          >
        </div>
        <p
          class="text-sm text-slate-400 font-bold uppercase tracking-[0.15em] flex items-center gap-2"
        >
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Incoming Orders
        </p>
      </div>

      <div class="flex items-center md:flex-col md:items-end gap-3 md:gap-0">
        <span
          class="text-4xl font-black text-slate-800 font-mono tracking-tighter leading-none"
        >
          {{ currentTime }}
        </span>
        <div
          class="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-green-200"
        >
          <span class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-green-500"
            ></span>
          </span>
          System Online
        </div>
      </div>
    </header>

    <div
      v-if="orders.length === 0"
      class="flex flex-col items-center justify-center h-[50vh] opacity-60 animate-fade-in"
    >
      <div
        class="w-40 h-40 bg-white rounded-full shadow-xl flex items-center justify-center mb-6 text-7xl border-4 border-slate-50"
      >
        🧑‍🍳
      </div>
      <div class="text-4xl font-bold font-['Playfair_Display'] text-[#800020]">
        All Clear, Chef!
      </div>
      <p
        class="text-slate-500 font-bold mt-2 uppercase tracking-widest text-sm"
      >
        Standing by for new tickets...
      </p>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
    >
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex flex-col bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 animate-slide-up overflow-hidden border border-slate-100"
      >
        <div class="bg-[#800020] p-5 text-white relative overflow-hidden">
          <div
            class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"
          ></div>

          <div class="flex justify-between items-start relative z-10">
            <div>
              <span
                class="text-[10px] font-bold opacity-70 uppercase tracking-widest"
                >Queue #</span
              >
              <h2
                class="text-5xl font-black tracking-tighter leading-none mt-1"
              >
                {{ order.queueNumber }}
              </h2>
            </div>
            <div class="text-right">
              <span
                class="block text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1"
                >Time In</span
              >
              <span
                class="inline-block bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-mono font-bold"
              >
                {{ formatTime(order.timestamp) }}
              </span>
            </div>
          </div>

          <div
            class="mt-4 flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/10"
          >
            <span class="text-lg">👤</span>
            <span class="font-bold text-sm tracking-wide truncate flex-1">
              {{ order.customerName || "Walk-in Customer" }}
            </span>
          </div>
        </div>

        <div class="flex-1 bg-white p-0 overflow-hidden relative">
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"
          ></div>

          <ul class="divide-y divide-slate-100">
            <li
              v-for="(item, idx) in order.items"
              :key="idx"
              class="p-4 flex items-start gap-3 group even:bg-rose-50/30"
            >
              <div
                class="mt-1 w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center shrink-0 group-hover:border-[#800020] transition-colors"
              >
                <div
                  class="w-2.5 h-2.5 bg-[#800020] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
              </div>

              <div class="flex-1">
                <span
                  class="text-lg font-bold text-slate-800 leading-snug block group-hover:text-[#800020] transition-colors"
                >
                  {{ item.name }}
                </span>
                <span
                  v-if="item.qty > 1"
                  class="inline-flex items-center mt-1 text-xs font-black text-white bg-[#800020] px-2 py-0.5 rounded"
                >
                  x{{ item.qty }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100">
          <div class="flex justify-between items-center mb-3 px-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase"
              >Order ID: {{ order.id.slice(0, 5).toUpperCase() }}</span
            >
            <span class="text-[10px] font-bold text-slate-400 uppercase">{{
              order.orderDate
            }}</span>
          </div>
          <button
            @click="markReady(order.id)"
            class="w-full py-4 bg-white border-2 border-[#800020] text-[#800020] hover:bg-[#800020] hover:text-white rounded-xl font-black text-sm tracking-[0.15em] uppercase shadow-sm hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-200 active:scale-95 flex items-center justify-center gap-3 group"
          >
            <span>Mark Ready</span>
            <span
              class="group-hover:translate-x-1 transition-transform duration-200"
              >→</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
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
const audio = new Audio("/noti.mp3"); // Path to sound in public/ folder

onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, 1000);

  const q = query(
    collection(db, "orders"),
    where("status", "==", "pending"),
    orderBy("timestamp", "asc"),
  );

  onSnapshot(q, (snapshot) => {
    const newOrders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Play sound if new order added (simple check: length increased)
    // For more robust checking, you can compare IDs
    if (newOrders.length > orders.value.length && orders.value.length !== 0) {
      playSound();
    }

    orders.value = newOrders;
  });
});

const playSound = () => {
  audio.play().catch((e) => {
    console.log("Autoplay prevented. Click document first.");
  });
};

const markReady = async (id) => {
  if (confirm("Is this order packed and ready?")) {
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
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}
</style>
