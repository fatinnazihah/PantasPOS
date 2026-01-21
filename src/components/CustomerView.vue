<template>
  <div
    class="min-h-screen pb-24 relative text-slate-700 font-sans selection:bg-rose-200"
  >
    <div
      class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[#FEF9C3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10"
    ></div>
    <div
      class="fixed top-[-10%] right-[-10%] w-96 h-96 bg-[#DBEAFE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10"
    ></div>

    <header class="pt-12 pb-4 text-center px-6">
      <div class="inline-block relative">
        <h1
          class="font-['Playfair_Display'] text-5xl font-black text-[#800020] tracking-wide mb-2 relative z-10 drop-shadow-sm"
        >
          Nama Kedai
        </h1>
        <div
          class="absolute bottom-2 left-0 w-full h-3 bg-[#FEF9C3] -rotate-1 rounded-full -z-0"
        ></div>
      </div>
      <p
        class="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mt-3"
      >
        Sweet Treats & Good Vibes
      </p>
    </header>

    <div
      class="sticky top-0 z-40 bg-white/30 backdrop-blur-md border-b border-white/20 mb-6"
    >
      <div
        class="max-w-5xl mx-auto px-4 overflow-x-auto py-4 scrollbar-hide flex gap-2 justify-start md:justify-center"
      >
        <button
          @click="selectedCategory = 'All'"
          :class="
            selectedCategory === 'All'
              ? 'bg-[#800020] text-white shadow-lg shadow-rose-900/20'
              : 'text-slate-600 hover:text-[#800020] hover:bg-white/50'
          "
          class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 border border-transparent"
        >
          All
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.name"
          :class="
            selectedCategory === cat.name
              ? 'bg-[#800020] text-white shadow-lg shadow-rose-900/20'
              : 'text-slate-600 hover:text-[#800020] hover:bg-white/50'
          "
          class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap flex-shrink-0 border border-transparent"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div class="px-6 max-w-5xl mx-auto min-h-[50vh]">
      <div
        v-if="filteredMenu.length === 0"
        class="text-center py-20 text-slate-400 font-bold italic"
      >
        No items in this category yet. 🧁
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="item in filteredMenu"
          :key="item.id"
          class="group bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-4 border border-white shadow-sm hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1"
        >
          <div
            class="relative aspect-square rounded-[2rem] overflow-hidden bg-[#FEF9C3] mb-4 shadow-inner"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-yellow-500/30"
            >
              <span class="text-5xl">🍪</span>
            </div>
            <div
              class="absolute bottom-4 right-4 bg-white/95 backdrop-blur text-[#800020] px-4 py-2 rounded-full font-black shadow-lg text-sm border border-rose-100"
            >
              RM {{ item.price }}
            </div>
          </div>

          <div class="px-3 pb-3">
            <h3
              class="font-['Playfair_Display'] font-bold text-2xl text-slate-800 mb-1 leading-tight group-hover:text-[#800020] transition-colors"
            >
              {{ item.name }}
            </h3>

            <div
              class="flex justify-between items-end mt-4 pt-4 border-t border-slate-100/50"
            >
              <div class="flex flex-col">
                <span
                  class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1"
                  >Daily Stock</span
                >
                <span
                  :class="
                    item.dailyStock > 0
                      ? 'text-green-600 bg-green-100/50 border-green-100'
                      : 'text-red-500 bg-red-100/50 border-red-100'
                  "
                  class="text-xs px-3 py-1 rounded-lg font-bold w-fit border"
                >
                  {{
                    item.dailyStock > 0 ? `${item.dailyStock} left` : "Sold Out"
                  }}
                </span>
              </div>

              <button
                v-if="item.dailyStock > 0"
                @click="openReservation(item)"
                class="bg-[#800020] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-rose-200 hover:bg-[#630330] hover:scale-105 active:scale-95 transition-all"
              >
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="showFeedbackModal = true"
      class="fixed bottom-8 right-8 bg-[#800020] text-white pl-6 pr-8 py-4 rounded-full font-bold shadow-2xl shadow-rose-900/30 flex items-center gap-3 hover:scale-105 transition active:scale-95 z-50 border-4 border-white/30 backdrop-blur-sm group"
    >
      <span class="text-2xl group-hover:rotate-12 transition">💌</span>
      <div class="text-left leading-none">
        <span
          class="block text-[10px] opacity-80 uppercase tracking-wider font-bold"
          >Customer</span
        >
        <span class="text-sm">Reviews</span>
      </div>
    </button>

    <div
      v-if="showFeedbackModal"
      class="fixed inset-0 bg-[#800020]/20 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity"
    >
      <div
        class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border-4 border-white flex flex-col max-h-[85vh] overflow-hidden animate-slide-up"
      >
        <div
          class="p-6 pb-4 flex justify-between items-center bg-rose-50/50 border-b border-rose-100"
        >
          <div>
            <h3
              class="font-['Playfair_Display'] font-bold text-2xl text-[#800020]"
            >
              Customer Feedback
            </h3>
            <p
              class="text-xs text-slate-400 font-bold uppercase tracking-wider"
            >
              See what others are saying
            </p>
          </div>
          <button
            @click="showFeedbackModal = false"
            class="w-10 h-10 bg-white rounded-full text-slate-400 font-bold hover:text-red-500 shadow-sm border border-slate-100 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div class="px-6 pt-4 pb-2">
          <div class="flex p-1 bg-slate-100 rounded-2xl">
            <button
              @click="feedbackTab = 'read'"
              :class="
                feedbackTab === 'read'
                  ? 'bg-white text-[#800020] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              "
              class="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            >
              Read Reviews
            </button>
            <button
              @click="feedbackTab = 'write'"
              :class="
                feedbackTab === 'write'
                  ? 'bg-white text-[#800020] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              "
              class="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            >
              Write Review
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto flex-1 bg-white">
          <div v-if="feedbackTab === 'read'" class="space-y-0">
            <div
              v-if="feedbacks.length === 0"
              class="text-center py-12 opacity-50"
            >
              <div class="text-4xl mb-2">💭</div>
              <p class="font-bold text-slate-400">
                No reviews yet. Be the first!
              </p>
            </div>

            <div
              v-for="fb in feedbacks"
              :key="fb.id"
              class="flex gap-4 p-4 border-b border-slate-100 animate-slide-up"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-lg shadow-sm border border-rose-200 overflow-hidden flex-shrink-0"
                >
                  <span class="text-xl">{{ fb.avatar || "👤" }}</span>
                </div>
                <div class="w-0.5 h-full bg-slate-100 my-2 rounded-full"></div>
              </div>

              <div class="flex-1 pb-4">
                <div class="flex justify-between items-start">
                  <p class="font-bold text-slate-800 text-sm">{{ fb.name }}</p>
                  <div class="flex items-center gap-2">
                    <p class="text-xs text-slate-400">
                      {{
                        fb.timestamp
                          ? new Date(
                              fb.timestamp.seconds * 1000,
                            ).toLocaleDateString()
                          : "Now"
                      }}
                    </p>
                  </div>
                </div>

                <p
                  class="text-slate-700 text-[15px] mt-1 mb-3 leading-relaxed whitespace-pre-wrap"
                >
                  {{ fb.message }}
                </p>

                <div v-if="fb.imageUrl" class="mb-3">
                  <img
                    :src="fb.imageUrl"
                    class="w-full h-auto max-h-80 object-cover rounded-xl border border-slate-100 shadow-sm"
                    loading="lazy"
                  />
                </div>

                <button
                  @click="handleLike(fb)"
                  class="flex items-center gap-1.5 group transition-all w-fit"
                  :class="
                    likedPosts.has(fb.id)
                      ? 'text-red-500'
                      : 'text-slate-400 hover:text-red-500'
                  "
                >
                  <span
                    class="text-xl transition-transform group-active:scale-125"
                    >{{ likedPosts.has(fb.id) ? "❤️" : "♡" }}</span
                  >
                  <span class="text-xs font-bold">{{
                    (fb.likes || 0) + (likedPosts.has(fb.id) ? 0 : 0)
                  }}</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="feedbackTab === 'write'" class="space-y-5">
            <div>
              <label
                class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block"
                >Choose Your Avatar</label
              >
              <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  v-for="emoji in avatars"
                  :key="emoji"
                  @click="feedback.avatar = emoji"
                  :class="
                    feedback.avatar === emoji
                      ? 'bg-rose-100 border-rose-300 scale-100'
                      : 'bg-slate-50 border-transparent grayscale opacity-70 hover:opacity-100 hover:grayscale-0'
                  "
                  class="w-10 h-10 flex items-center justify-center text-xl rounded-full border-2 transition-all flex-shrink-0"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div class="group relative">
              <input
                v-model="feedback.name"
                placeholder=" "
                class="peer w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-slate-700 focus:border-[#800020]/20 focus:bg-white transition outline-none font-bold"
              />
              <label
                class="absolute left-4 top-4 text-slate-400 text-xs font-bold transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#800020] pointer-events-none uppercase tracking-wide"
                >Your Name</label
              >
            </div>

            <div class="group relative">
              <textarea
                v-model="feedback.message"
                placeholder=" "
                class="peer w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-slate-700 h-32 resize-none focus:border-[#800020]/20 focus:bg-white transition outline-none"
              ></textarea>
              <label
                class="absolute left-4 top-4 text-slate-400 text-xs font-bold transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#800020] pointer-events-none uppercase tracking-wide"
                >Your Review</label
              >
            </div>

            <label
              class="flex items-center justify-center w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-rose-50 hover:border-rose-200 transition group overflow-hidden relative"
            >
              <div
                v-if="!feedbackFile"
                class="flex items-center gap-2 text-slate-400 group-hover:text-[#800020]"
              >
                <span class="text-lg">📸</span>
                <span class="text-xs font-bold">Add Photo (Optional)</span>
              </div>
              <div
                v-else
                class="text-xs font-bold text-green-600 flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full"
              >
                <span>✓</span> Image Selected
              </div>
              <input type="file" @change="handleFileUpload" class="hidden" />
            </label>

            <button
              @click="submitFeedback"
              :disabled="uploading"
              class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 active:scale-95 transition disabled:opacity-50 hover:bg-[#630330] flex justify-center items-center gap-2"
            >
              <span v-if="uploading" class="animate-spin">⏳</span>
              {{ uploading ? "Posting..." : "Post Review" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-[#800020]/20 backdrop-blur-sm flex items-center justify-center p-6 z-50 transition-opacity"
    >
      <div
        class="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border-4 border-white transform transition-all scale-100 animate-slide-up"
      >
        <h3
          class="font-['Playfair_Display'] font-bold text-2xl mb-1 text-[#800020]"
        >
          Reserve it.
        </h3>
        <p
          class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6"
        >
          Confirm via WhatsApp
        </p>

        <div
          class="bg-[#FEF9C3]/50 border border-[#FEF9C3] p-4 rounded-2xl mb-6 flex items-center gap-4"
        >
          <div
            class="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm"
          >
            🧁
          </div>
          <div>
            <p class="font-bold text-slate-800 text-lg leading-none mb-1">
              {{ selectedItem?.name }}
            </p>
            <p class="text-xs font-bold text-slate-500">
              RM {{ selectedItem?.price }} / unit
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <input
            v-model="reservation.customerName"
            placeholder="Your Name"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-slate-700"
          />
          <div class="flex items-center gap-3">
            <div
              class="bg-slate-50 p-4 rounded-2xl flex-1 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center"
            >
              Quantity needed:
            </div>
            <input
              type="number"
              v-model="reservation.qty"
              min="1"
              :max="selectedItem?.dailyStock"
              class="w-24 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-black text-center text-xl text-[#800020]"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button
            @click="showModal = false"
            class="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
          >
            Cancel
          </button>
          <button
            @click="confirmReservation"
            class="flex-1 bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-[#630330] transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db, storage } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const menuItems = ref([]);
const categories = ref([]);
const feedbacks = ref([]);
const selectedCategory = ref("All");

// Modals & Tabs
const showModal = ref(false);
const showFeedbackModal = ref(false);
const feedbackTab = ref("read");

// Forms
const selectedItem = ref(null);
const uploading = ref(false);
const feedbackFile = ref(null);
const feedback = ref({ name: "", message: "", avatar: "👤" }); // Default Avatar
const reservation = ref({ customerName: "", qty: 1 });

// Avatars List
const avatars = [
  "👤",
  "👩",
  "👨",
  "🧑‍🍳",
  "🧚",
  "🦸",
  "🐱",
  "🐶",
  "🦄",
  "🐼",
  "🦊",
  "🐸",
];

// Tracking Liked Posts (Session-based)
const likedPosts = ref(new Set());

onMounted(() => {
  // 1. Load Menu
  onSnapshot(collection(db, "menu"), (snapshot) => {
    menuItems.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  // 2. Load Categories
  const catQuery = query(collection(db, "categories"), orderBy("name", "asc"));
  onSnapshot(catQuery, (snap) => {
    categories.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });

  // 3. Load Reviews
  const fbQuery = query(
    collection(db, "feedback"),
    orderBy("timestamp", "desc"),
  );
  onSnapshot(fbQuery, (snap) => {
    feedbacks.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
});

const filteredMenu = computed(() => {
  if (selectedCategory.value === "All") return menuItems.value;
  return menuItems.value.filter(
    (item) => item.category === selectedCategory.value,
  );
});

const openReservation = (item) => {
  selectedItem.value = item;
  reservation.value.qty = 1;
  showModal.value = true;
};

const confirmReservation = async () => {
  if (!reservation.value.customerName) return alert("Please enter your name");

  await addDoc(collection(db, "reservations"), {
    ...reservation.value,
    item: selectedItem.value.name,
    status: "pending",
    timestamp: serverTimestamp(),
  });

  const phone = "60102847208";
  const text = `Hi! My name is ${reservation.value.customerName}. I'd like to reserve ${reservation.value.qty}x ${selectedItem.value.name}.`;
  window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const handleFileUpload = (e) => {
  feedbackFile.value = e.target.files[0];
};

const submitFeedback = async () => {
  if (!feedback.value.message || !feedback.value.name)
    return alert("Please fill in your name and message!");
  uploading.value = true;
  let imageUrl = "";

  if (feedbackFile.value) {
    const fileRef = storageRef(
      storage,
      `feedback/${Date.now()}_${feedbackFile.value.name}`,
    );
    await uploadBytes(fileRef, feedbackFile.value);
    imageUrl = await getDownloadURL(fileRef);
  }

  await addDoc(collection(db, "feedback"), {
    ...feedback.value,
    imageUrl,
    likes: 0,
    timestamp: serverTimestamp(),
  });

  feedback.value = { name: "", message: "", avatar: "👤" };
  feedbackFile.value = null;
  uploading.value = false;
  feedbackTab.value = "read";
};

const handleLike = async (fb) => {
  if (likedPosts.value.has(fb.id)) return;
  likedPosts.value.add(fb.id);
  await updateDoc(doc(db, "feedback", fb.id), {
    likes: increment(1),
  });
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
