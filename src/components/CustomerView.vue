<template>
  <div
    class="min-h-screen pb-32 relative text-slate-700 font-sans selection:bg-rose-200"
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
          Ruang Sejenak
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
        class="max-w-5xl mx-auto px-4 overflow-x-auto py-4 scrollbar-hide flex gap-2 justify-center"
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

    <div class="px-4 md:px-6 max-w-5xl mx-auto min-h-[50vh]">
      <div
        v-if="filteredMenu.length === 0"
        class="text-center py-20 text-slate-400 font-bold italic"
      >
        No items in this category yet. 🧁
      </div>

      <div
        v-else
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8"
      >
        <div
          v-for="item in filteredMenu"
          :key="item.id"
          @click="openDetails(item)"
          class="group bg-white/60 backdrop-blur-sm rounded-[2rem] p-3 md:p-4 border border-white shadow-sm hover:shadow-xl hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
        >
          <div
            class="relative aspect-square rounded-[1.5rem] overflow-hidden bg-[#FEF9C3] mb-3 shadow-inner"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              class="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-yellow-500/30"
            >
              <span class="text-4xl md:text-5xl">🍪</span>
            </div>
            <div
              class="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-white/95 backdrop-blur text-[#800020] px-3 py-1 md:px-4 md:py-2 rounded-full font-black shadow-lg text-xs md:text-sm border border-rose-100"
            >
              RM {{ item.price }}
            </div>
            <div
              v-if="getItemQtyInCart(item.id) > 0"
              class="absolute top-2 right-2 bg-[#800020] text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md animate-bounce"
            >
              {{ getItemQtyInCart(item.id) }}
            </div>
          </div>

          <div class="px-1 pb-1">
            <h3
              class="font-['Playfair_Display'] font-bold text-lg md:text-2xl text-slate-800 mb-1 leading-tight group-hover:text-[#800020] transition-colors truncate"
            >
              {{ item.name }}
            </h3>

            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-end mt-2 pt-2 border-t border-slate-100/50 gap-2 md:gap-0"
            >
              <span
                :class="
                  item.dailyStock > 0
                    ? 'text-green-600 bg-green-100/50 border-green-100'
                    : 'text-red-500 bg-red-100/50 border-red-100'
                "
                class="text-[10px] px-2 py-1 rounded-lg font-bold w-fit border"
              >
                {{
                  item.dailyStock > 0 ? `${item.dailyStock} left` : "Sold Out"
                }}
              </span>

              <button
                v-if="item.dailyStock > 0"
                @click.stop="addToCart(item)"
                class="w-full md:w-auto bg-[#800020] text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold shadow-lg shadow-rose-200 hover:bg-[#630330] hover:scale-105 active:scale-95 transition-all"
              >
                Add +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-8 left-8 z-50 group flex items-center gap-3">
      <a
        href="https://wa.me/60102847208"
        target="_blank"
        class="bg-[#25D366] text-white w-14 h-14 rounded-full font-bold shadow-xl shadow-green-900/20 flex items-center justify-center hover:scale-110 transition active:scale-95 border-4 border-white/50 backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
          />
        </svg>
      </a>
      <span
        class="bg-white text-slate-600 text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-100 transition-all opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none"
      >
        Need Help?
      </span>
    </div>

    <button
      @click="showTracker = true"
      class="fixed bottom-28 right-8 bg-[#FEF9C3] text-yellow-800 pl-6 pr-8 py-4 rounded-full font-bold shadow-xl shadow-yellow-900/10 flex items-center gap-3 hover:scale-105 transition active:scale-95 z-50 border-4 border-white/50 backdrop-blur-sm group"
    >
      <span class="text-2xl group-hover:scale-110 transition">🔍</span>
      <div class="text-left leading-none">
        <span
          class="block text-[10px] opacity-70 uppercase tracking-wider font-bold"
          >Track</span
        >
        <span class="text-sm">Order</span>
      </div>
    </button>

    <div v-if="cart.length > 0">
      <button
        @click="showCartModal = true"
        class="fixed bottom-8 right-8 bg-[#800020] text-white pl-6 pr-8 py-4 rounded-full font-bold shadow-2xl shadow-rose-900/30 flex items-center gap-3 hover:scale-105 transition active:scale-95 z-50 border-4 border-white/30 backdrop-blur-sm group animate-slide-up"
      >
        <span class="text-2xl">🛍️</span>
        <div class="text-left leading-none">
          <span
            class="block text-[10px] opacity-80 uppercase tracking-wider font-bold"
            >{{ cartItemsCount }} Items</span
          >
          <span class="text-sm">RM {{ cartTotal }}</span>
        </div>
      </button>
    </div>

    <div
      v-else
      class="fixed bottom-8 right-8 z-50 group flex flex-col items-end gap-2"
    >
      <button
        @click="showFeedbackModal = true"
        class="bg-[#800020] text-white pl-6 pr-8 py-4 rounded-full font-bold shadow-2xl shadow-rose-900/30 flex items-center gap-3 hover:scale-105 transition active:scale-95 border-4 border-white/30 backdrop-blur-sm"
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
    </div>

    <div
      v-if="showTracker"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-all"
      @click.self="showTracker = false"
    >
      <OrderTracker @close="showTracker = false" />
    </div>

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-[#800020]/20 backdrop-blur-sm flex items-center justify-center p-6 z-50 transition-opacity"
      @click.self="showDetailsModal = false"
    >
      <div
        class="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl border-4 border-white transform transition-all scale-100 animate-slide-up overflow-hidden"
      >
        <div v-if="selectedItem?.imageUrl" class="relative h-64 bg-[#FEF9C3]">
          <img
            :src="selectedItem.imageUrl"
            class="w-full h-full object-cover"
          />
          <button
            @click="showDetailsModal = false"
            class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full text-slate-500 font-bold hover:text-red-500 flex items-center justify-center shadow-lg transition"
          >
            ✕
          </button>
        </div>
        <div v-else class="flex justify-end p-4 pb-0">
          <button
            @click="showDetailsModal = false"
            class="w-10 h-10 bg-slate-100 rounded-full text-slate-500 font-bold hover:text-red-500 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        <div class="p-8 pt-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3
                class="font-['Playfair_Display'] font-bold text-3xl text-[#800020] leading-tight"
              >
                {{ selectedItem?.name }}
              </h3>
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                {{ selectedItem?.category }}
              </span>
            </div>
            <div
              class="bg-rose-50 text-[#800020] px-3 py-1 rounded-xl font-black text-sm"
            >
              RM {{ selectedItem?.price }}
            </div>
          </div>

          <p class="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
            {{
              selectedItem?.description ||
              "Delicious homemade goodness baked with love."
            }}
          </p>

          <div class="flex gap-3">
            <button
              v-if="selectedItem?.dailyStock > 0"
              @click="
                showDetailsModal = false;
                addToCart(selectedItem);
              "
              class="flex-1 bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-[#630330] transition active:scale-95"
            >
              Add to Cart
            </button>
            <button
              v-else
              disabled
              class="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-bold cursor-not-allowed"
            >
              Sold Out
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCartModal"
      class="fixed inset-0 bg-[#800020]/20 backdrop-blur-sm flex items-center justify-center p-6 z-50 transition-opacity"
    >
      <div
        class="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border-4 border-white transform transition-all scale-100 animate-slide-up flex flex-col max-h-[80vh]"
      >
        <div class="flex justify-between items-center mb-6">
          <h3
            class="font-['Playfair_Display'] font-bold text-2xl text-[#800020]"
          >
            Your Cart
          </h3>
          <button
            @click="showCartModal = false"
            class="w-8 h-8 bg-slate-100 rounded-full text-slate-400 font-bold hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <div class="overflow-y-auto flex-1 mb-6 pr-1 space-y-3">
          <div
            v-for="(item, index) in cart"
            :key="index"
            class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl"
          >
            <div>
              <p class="font-bold text-slate-700 leading-tight">
                {{ item.name }}
              </p>
              <p class="text-xs text-slate-400">RM {{ item.price }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-black text-[#800020]">x{{ item.qty }}</span>
              <button
                @click="removeFromCart(index)"
                class="text-red-400 font-bold hover:text-red-600 px-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-3 border-t border-slate-100 pt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-bold text-slate-400 uppercase"
              >Total</span
            >
            <span class="text-2xl font-black text-[#800020]"
              >RM {{ cartTotal }}</span
            >
          </div>

          <input
            v-model="customerName"
            placeholder="Enter Your Name"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-slate-700 text-center"
          />

          <button
            @click="confirmOrder"
            class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-[#630330] transition active:scale-95"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-[#800020]/90 backdrop-blur-md flex items-center justify-center p-6 z-[60] animate-slide-up"
    >
      <div
        class="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
      >
        <div
          class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200"
        ></div>

        <div class="text-6xl mb-4 animate-bounce">🎫</div>
        <h3
          class="font-['Playfair_Display'] font-bold text-3xl text-[#800020] mb-2"
        >
          Order Sent!
        </h3>

        <div
          class="bg-rose-50 rounded-2xl p-4 mb-6 text-sm text-rose-900 leading-relaxed"
        >
          <p class="font-bold mb-1">Please pay & pickup at counter.</p>
          <p class="text-xs opacity-80">We accept:</p>
          <div
            class="flex justify-center gap-2 mt-2 font-bold text-[10px] uppercase tracking-wide text-rose-700"
          >
            <span
              class="bg-white px-2 py-1 rounded border border-rose-100 shadow-sm"
              >💵 Cash</span
            >
            <span
              class="bg-white px-2 py-1 rounded border border-rose-100 shadow-sm"
              >📲 DuitNow</span
            >
            <span
              class="bg-white px-2 py-1 rounded border border-rose-100 shadow-sm"
              >💳 TnG</span
            >
          </div>
        </div>

        <div
          class="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 relative"
        >
          <div
            class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#800020] rounded-full"
          ></div>
          <div
            class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#800020] rounded-full"
          ></div>

          <div
            class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            Queue Number
          </div>
          <div class="text-6xl font-black text-slate-800 tracking-tighter">
            #{{ lastOrderDetails.queue }}
          </div>

          <div class="w-full h-px bg-slate-100 my-4"></div>

          <div
            class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1"
          >
            Name
          </div>
          <div class="text-xl font-bold text-[#800020]">
            {{ lastOrderDetails.name }}
          </div>
        </div>

        <button
          @click="showSuccessModal = false"
          class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 active:scale-95 transition hover:bg-[#630330]"
        >
          Got it!
        </button>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { db, storage } from "../firebase";
import OrderTracker from "../components/OrderTracker.vue";
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
  runTransaction,
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
const showTracker = ref(false);

// Modals & Tabs
const showFeedbackModal = ref(false);
const showDetailsModal = ref(false);
const showCartModal = ref(false);
const showSuccessModal = ref(false);
const feedbackTab = ref("read");

// Cart Logic
const cart = ref([]);
const customerName = ref("");

// Forms
const selectedItem = ref(null);
const uploading = ref(false);
const feedbackFile = ref(null);
const feedback = ref({ name: "", message: "", avatar: "👤" });
const lastOrderDetails = ref({ queue: null, name: "" });

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

const likedPosts = ref(new Set());

onMounted(() => {
  onSnapshot(collection(db, "menu"), (snapshot) => {
    menuItems.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  });

  const catQuery = query(collection(db, "categories"), orderBy("name", "asc"));
  onSnapshot(catQuery, (snap) => {
    categories.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });

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

// --- CART LOGIC ---

const addToCart = (item) => {
  const existing = cart.value.find((i) => i.id === item.id);
  if (existing) {
    if (existing.qty < item.dailyStock) {
      existing.qty++;
    } else {
      alert("Max stock reached for this item!");
    }
  } else {
    cart.value.push({ ...item, qty: 1 });
  }
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const getItemQtyInCart = (id) => {
  const item = cart.value.find((i) => i.id === id);
  return item ? item.qty : 0;
};

const cartTotal = computed(() =>
  cart.value.reduce((acc, item) => acc + item.price * item.qty, 0),
);

const cartItemsCount = computed(() =>
  cart.value.reduce((acc, item) => acc + item.qty, 0),
);

// Open details (simplified)
const openDetails = (item) => {
  selectedItem.value = item;
  showDetailsModal.value = true;
};

// --- QUEUE & ORDER ---

const getDailyQueueNumber = async () => {
  const todayStr = new Date().toISOString().split("T")[0];
  const counterRef = doc(db, "counters", "daily_queue");

  try {
    const newQ = await runTransaction(db, async (transaction) => {
      const sfDoc = await transaction.get(counterRef);
      let nextNum = 1;

      if (sfDoc.exists()) {
        const data = sfDoc.data();
        if (data.date === todayStr) {
          nextNum = data.current + 1;
        }
      }

      transaction.set(counterRef, {
        current: nextNum,
        date: todayStr,
      });

      return nextNum;
    });
    return newQ;
  } catch (e) {
    console.error("Queue Error:", e);
    return Math.floor(Math.random() * 1000);
  }
};

const confirmOrder = async () => {
  if (!customerName.value) return alert("Please enter your name");
  if (cart.value.length === 0) return alert("Cart is empty");

  const queueNum = await getDailyQueueNumber();

  await addDoc(collection(db, "orders"), {
    customerName: customerName.value,
    items: cart.value, // Sends the whole cart array
    total: cartTotal.value,
    status: "pending",
    paymentMethod: "counter",
    queueNumber: queueNum,
    orderDate: new Date().toISOString().split("T")[0],
    timestamp: serverTimestamp(),
  });

  localStorage.setItem("pantas_active_queue", queueNum);
  localStorage.setItem(
    "pantas_order_date",
    new Date().toISOString().split("T")[0],
  );

  lastOrderDetails.value = {
    queue: queueNum,
    name: customerName.value,
  };

  // Reset
  cart.value = [];
  customerName.value = "";
  showCartModal.value = false;
  showSuccessModal.value = true;
};

// --- FEEDBACK & UPLOAD ---
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
