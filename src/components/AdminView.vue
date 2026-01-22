<template>
  <div
    class="min-h-screen relative overflow-hidden font-sans text-slate-700 selection:bg-rose-200"
  >
    <div
      class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-[#FEF9C3] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10"
    ></div>
    <div
      class="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-[#DBEAFE] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10"
    ></div>

    <div
      v-if="popup.show"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#800020]/20 backdrop-blur-sm transition-all"
    >
      <div
        class="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border-4 animate-slide-up"
        :class="
          popup.type === 'success' ? 'border-green-100' : 'border-red-100'
        "
      >
        <div class="text-4xl mb-4 animate-bounce">
          {{ popup.type === "success" ? "🎉" : "⚠️" }}
        </div>
        <h3
          class="font-['Playfair_Display'] font-bold text-2xl mb-2 text-[#800020]"
        >
          {{ popup.title }}
        </h3>
        <p class="text-slate-500 mb-6 font-medium">{{ popup.message }}</p>
        <button
          @click="popup.show = false"
          class="w-full bg-[#800020] text-white py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg shadow-rose-200"
        >
          Okay
        </button>
      </div>
    </div>

    <div
      v-if="!isAuthenticated"
      class="h-screen flex flex-col items-center justify-center p-6"
    >
      <div
        class="bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-xl w-full max-w-sm text-center border border-white"
      >
        <div
          class="w-20 h-20 bg-rose-50 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-inner border border-rose-100"
        >
          🔒
        </div>
        <h2
          class="text-3xl font-['Playfair_Display'] font-bold mb-2 text-[#800020]"
        >
          Admin Access
        </h2>
        <p
          class="text-slate-400 text-sm mb-8 font-bold uppercase tracking-widest"
        >
          Ruang Sejenak
        </p>

        <input
          type="password"
          v-model="pinInput"
          placeholder="••••"
          class="w-full text-center text-3xl tracking-[0.5em] p-4 bg-slate-50 border-0 rounded-2xl mb-6 focus:ring-2 focus:ring-[#800020]/20 outline-none text-[#800020] transition placeholder:text-slate-300"
          @keyup.enter="handleLogin"
        />
        <button
          @click="handleLogin"
          class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:scale-105 transition active:scale-95"
        >
          Unlock Dashboard
        </button>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto p-4 md:p-6 pb-24">
      <header
        class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/80 backdrop-blur p-6 rounded-[2rem] shadow-sm border border-white"
      >
        <div class="text-center md:text-left">
          <h1
            class="text-3xl font-['Playfair_Display'] font-bold text-[#800020]"
          >
            Dashboard
          </h1>
          <p
            class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1"
          >
            Welcome back, Boss.
          </p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <a
            href="/kitchen"
            target="_blank"
            class="flex-1 md:flex-none bg-[#FEF9C3] text-yellow-800 px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-yellow-200 transition shadow-sm"
            >Kitchen 👨‍🍳</a
          >
          <button
            @click="logout"
            class="flex-1 md:flex-none bg-slate-100 text-slate-500 px-6 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div
        class="flex flex-wrap gap-2 mb-6 p-2 bg-white/60 backdrop-blur rounded-2xl w-full md:w-fit border border-white mx-auto md:mx-0 overflow-x-auto"
      >
        <button
          v-for="tab in [
            'pos',
            'stock',
            'inventory',
            'finance',
            'history',
            'reviews',
          ]"
          :key="tab"
          @click="currentTab = tab"
          :class="
            currentTab === tab
              ? 'bg-[#800020] text-white shadow-lg shadow-rose-200'
              : 'text-slate-400 hover:text-[#800020] hover:bg-white/50'
          "
          class="px-5 py-3 rounded-xl font-bold capitalize text-sm transition-all whitespace-nowrap flex-1 md:flex-none text-center"
        >
          {{ tab }}
        </button>
      </div>

      <div
        v-if="currentTab === 'pos'"
        class="h-[calc(100vh-280px)] flex flex-col md:flex-row gap-6 relative"
      >
        <div class="flex-1 flex flex-col h-full overflow-hidden">
          <div class="flex-shrink-0 mb-4">
            <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
              <button
                @click="selectedCategory = 'all'"
                :class="
                  selectedCategory === 'all'
                    ? 'bg-[#800020] text-white shadow-lg shadow-rose-900/20'
                    : 'bg-white text-slate-600 border border-slate-200'
                "
                class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 snap-start"
              >
                All Items
              </button>
              <button
                v-for="cat in menuCats"
                :key="cat.id"
                @click="selectedCategory = cat.name"
                :class="
                  selectedCategory === cat.name
                    ? 'bg-[#800020] text-white shadow-lg shadow-rose-900/20'
                    : 'bg-white text-slate-600 border border-slate-200'
                "
                class="px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 snap-start"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div class="overflow-y-auto flex-1 pr-1 pb-32 md:pb-0 scrollbar-hide">
            <div
              v-if="filteredMenu.length === 0"
              class="flex flex-col items-center justify-center h-40 text-slate-400"
            >
              <span class="text-4xl mb-2">🍪</span>
              <p class="text-sm font-bold">No items found</p>
            </div>

            <div
              class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
            >
              <div
                v-for="item in filteredMenu"
                :key="item.id"
                @click="item.dailyStock > 0 ? addToCart(item) : null"
                class="relative group bg-white rounded-2xl p-3 border border-slate-100 shadow-sm transition-all duration-200 select-none"
                :class="
                  item.dailyStock > 0
                    ? 'active:scale-95 active:border-[#800020] cursor-pointer hover:shadow-md'
                    : 'opacity-60 grayscale cursor-not-allowed bg-slate-50'
                "
              >
                <div
                  class="aspect-square rounded-xl bg-[#FEF9C3] mb-3 overflow-hidden relative"
                >
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-3xl"
                  >
                    🍪
                  </div>

                  <div
                    class="absolute bottom-1 right-1 bg-white/90 backdrop-blur text-[#800020] text-xs font-black px-2 py-1 rounded-lg shadow-sm"
                  >
                    RM{{ item.price }}
                  </div>

                  <div
                    v-if="item.dailyStock <= 0"
                    class="absolute inset-0 bg-black/10 flex items-center justify-center"
                  >
                    <span
                      class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                      >Sold Out</span
                    >
                  </div>
                </div>

                <div class="flex justify-between items-start">
                  <div class="flex-1 min-w-0">
                    <h3
                      class="font-bold text-slate-700 text-sm leading-tight truncate"
                    >
                      {{ item.name }}
                    </h3>
                    <p
                      class="text-[10px] font-bold mt-1"
                      :class="
                        item.dailyStock < 5 ? 'text-red-500' : 'text-slate-400'
                      "
                    >
                      {{
                        item.dailyStock > 0
                          ? item.dailyStock + " left"
                          : "0 left"
                      }}
                    </p>
                  </div>
                  <button
                    v-if="item.dailyStock > 0"
                    class="w-6 h-6 bg-[#800020] text-white rounded-full flex items-center justify-center text-xs shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="cart.length > 0"
          @click="showMobileCart = true"
          class="md:hidden fixed bottom-6 right-6 z-50 bg-[#800020] text-white pl-5 pr-6 py-4 rounded-full font-bold shadow-2xl shadow-rose-900/30 flex items-center gap-3 active:scale-95 transition animate-slide-up"
        >
          <div class="relative">
            <span class="text-2xl">🛍️</span>
            <span
              class="absolute -top-1 -right-1 bg-yellow-400 text-[#800020] text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black border border-white"
            >
              {{ cart.reduce((acc, i) => acc + i.qty, 0) }}
            </span>
          </div>
          <div class="text-left leading-none">
            <span
              class="block text-[10px] opacity-80 uppercase tracking-wider font-bold"
              >Total</span
            >
            <span class="text-sm">RM {{ cartTotal }}</span>
          </div>
        </button>

        <div
          v-if="showMobileCart"
          class="md:hidden fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity"
          @click="showMobileCart = false"
        ></div>

        <div
          :class="[
            'bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-xl border-t md:border border-slate-100 flex flex-col transition-all duration-300',
            // Mobile Styles
            'fixed bottom-0 left-0 right-0 z-[70] rounded-t-[2.5rem] max-h-[80vh]',
            showMobileCart
              ? 'translate-y-0'
              : 'translate-y-[110%] md:translate-y-0',
            // Desktop Styles
            'md:static md:w-96 md:rounded-[2.5rem] md:h-auto md:translate-y-0',
          ]"
        >
          <div
            class="md:hidden w-full flex justify-center pt-3 pb-1"
            @click="showMobileCart = false"
          >
            <div class="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div class="p-5 md:p-6 flex-1 flex flex-col overflow-hidden">
            <div class="flex justify-between items-center mb-4">
              <h3
                class="font-['Playfair_Display'] font-bold text-xl text-[#800020]"
              >
                Current Order
              </h3>
              <button
                @click="showMobileCart = false"
                class="md:hidden w-8 h-8 bg-slate-100 rounded-full text-slate-500 font-bold"
              >
                ✕
              </button>
              <span
                class="hidden md:inline-block bg-rose-50 text-[#800020] text-xs font-bold px-2 py-1 rounded-lg"
              >
                {{ cart.reduce((acc, i) => acc + i.qty, 0) }} Items
              </span>
            </div>

            <div
              v-if="cart.length === 0"
              class="flex-1 flex flex-col items-center justify-center text-slate-300 py-12 md:py-8 border-2 border-dashed border-slate-100 rounded-2xl"
            >
              <span class="text-4xl mb-2">🛍️</span>
              <p class="text-xs font-bold uppercase tracking-wider">
                Cart Empty
              </p>
            </div>

            <div
              v-else
              class="flex-1 overflow-y-auto pr-1 space-y-2 mb-4 scrollbar-thin max-h-[50vh] md:max-h-full"
            >
              <div
                v-for="(item, index) in cart"
                :key="index"
                class="flex justify-between items-center bg-slate-50 p-3 rounded-xl animate-slide-up"
              >
                <div class="flex flex-col">
                  <span class="font-bold text-slate-700 text-sm line-clamp-1">{{
                    item.name
                  }}</span>
                  <span class="text-[10px] text-slate-400"
                    >RM {{ item.price }} / unit</span
                  >
                </div>

                <div class="flex items-center gap-3">
                  <span class="font-mono font-bold text-slate-800"
                    >x{{ item.qty }}</span
                  >
                  <button
                    @click="removeFromCart(index)"
                    class="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 text-red-500 rounded-full hover:bg-red-50 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-auto pt-2">
              <div class="flex justify-between items-end mb-4 px-1">
                <span
                  class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >Total Amount</span
                >
                <span class="text-3xl font-black text-[#800020] tracking-tight"
                  >RM {{ cartTotal }}</span
                >
              </div>

              <button
                @click="handleCheckout"
                :disabled="cart.length === 0"
                class="w-full bg-[#800020] hover:bg-[#600015] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Confirm Payment</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="currentTab === 'stock'"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white"
        >
          <div class="flex justify-between items-center mb-6">
            <h3
              class="font-['Playfair_Display'] font-bold text-xl text-[#800020]"
            >
              {{ formMode === "add" ? "Add New Item" : "Edit Item" }}
            </h3>
            <button
              v-if="formMode === 'edit'"
              @click="resetForm"
              class="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full"
            >
              Cancel
            </button>
          </div>

          <div class="space-y-4">
            <label
              class="block w-full h-40 rounded-2xl overflow-hidden bg-slate-50 relative group cursor-pointer border-2 border-dashed border-slate-200 hover:border-rose-300 transition"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center text-slate-400"
              >
                <span class="text-2xl mb-2">📷</span>
                <span class="text-xs font-bold">Upload Photo</span>
              </div>
              <input type="file" @change="handleFileSelect" class="hidden" />
            </label>

            <input
              v-model="newItem.name"
              placeholder="Item Name"
              class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold"
            />

            <textarea
              v-model="newItem.description"
              placeholder="Description (e.g. Contains nuts...)"
              class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 h-24 resize-none"
            ></textarea>

            <div class="flex gap-2">
              <div class="relative w-1/2">
                <select
                  v-model="newItem.category"
                  class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 appearance-none font-bold text-slate-600"
                >
                  <option value="" disabled>Category</option>
                  <option
                    v-for="cat in menuCats"
                    :key="cat.id"
                    :value="cat.name"
                  >
                    {{ cat.name }}
                  </option>
                </select>
                <div
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                >
                  ▼
                </div>
              </div>
              <button
                @click="handleCreateCategory"
                class="bg-rose-50 text-[#800020] px-4 rounded-2xl font-bold text-xl hover:bg-rose-100 transition"
              >
                +
              </button>
              <input
                v-model="newItem.price"
                type="number"
                placeholder="Price"
                class="w-1/3 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold"
              />
            </div>

            <div class="flex gap-4">
              <div class="w-1/2">
                <label
                  class="text-[10px] font-bold text-slate-400 ml-2 mb-1 block uppercase"
                  >Daily Limit</label
                >
                <input
                  v-model="newItem.dailyStock"
                  type="number"
                  class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-center"
                />
              </div>
              <div class="w-1/2">
                <label
                  class="text-[10px] font-bold text-slate-400 ml-2 mb-1 block uppercase"
                  >Total Stock</label
                >
                <input
                  v-model="newItem.stock"
                  type="number"
                  class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-center"
                />
              </div>
            </div>

            <button
              @click="handleSaveItem"
              class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-[#600015] active:scale-95 transition"
            >
              {{ formMode === "add" ? "Save Item" : "Update Item" }}
            </button>
          </div>
        </div>

        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-[80vh] overflow-y-auto"
        >
          <h3
            class="font-['Playfair_Display'] font-bold text-xl mb-6 text-[#800020]"
          >
            Stock Manager
          </h3>
          <div
            v-for="item in menu"
            :key="item.id"
            class="border-b border-slate-50 py-4 last:border-0 relative group"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <span
                  class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                  >{{ item.category }}</span
                >
                <span class="font-bold text-slate-700 text-lg">{{
                  item.name
                }}</span>
              </div>
              <div
                class="flex gap-2 opacity-0 group-hover:opacity-100 transition"
              >
                <button
                  @click="editItem(item)"
                  class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(item.id)"
                  class="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold"
                >
                  Del
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs font-bold text-slate-400 w-12">DAILY:</span>
              <div class="flex items-center bg-slate-50 rounded-lg p-1">
                <button
                  @click="updateStock(item.id, 'dailyStock', -1)"
                  class="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-red-500 font-bold hover:bg-red-50"
                >
                  -
                </button>
                <span class="w-8 text-center font-bold text-sm">{{
                  item.dailyStock
                }}</span>
                <button
                  @click="updateStock(item.id, 'dailyStock', 1)"
                  class="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-green-500 font-bold hover:bg-green-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'inventory'" class="relative">
        <div class="flex items-center justify-between mb-6">
          <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
            <button
              @click="selectedInvCategory = 'All'"
              :class="
                selectedInvCategory === 'All'
                  ? 'bg-[#800020] text-white'
                  : 'text-slate-500 hover:text-[#800020]'
              "
              class="px-5 py-2 rounded-full text-xs font-bold border border-transparent transition-all whitespace-nowrap shadow-sm"
            >
              All
            </button>
            <button
              v-for="cat in invCategories"
              :key="cat"
              @click="selectedInvCategory = cat"
              :class="
                selectedInvCategory === cat
                  ? 'bg-[#800020] text-white'
                  : 'text-slate-500 hover:text-[#800020]'
              "
              class="px-5 py-2 rounded-full text-xs font-bold border border-transparent transition-all whitespace-nowrap shadow-sm"
            >
              {{ cat }}
            </button>
          </div>
          <div class="text-right hidden md:block">
            <span
              class="text-xs text-slate-400 font-bold uppercase tracking-wider block"
              >Total Value</span
            >
            <span class="text-xl font-black text-[#800020]"
              >RM {{ totalInventoryValue }}</span
            >
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="item in filteredInventory"
            :key="item.id"
            class="bg-white p-5 rounded-[2rem] border border-slate-50 hover:shadow-lg transition group relative"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-50"
                >
                  {{
                    item.category === "Ingredients"
                      ? "🥕"
                      : item.category === "Packaging"
                        ? "📦"
                        : "🔧"
                  }}
                </div>
                <div>
                  <p
                    class="font-bold text-slate-700 text-lg leading-none cursor-pointer hover:text-[#800020]"
                    @click="openEditForm(item)"
                  >
                    {{ item.name }}
                  </p>
                  <p
                    class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1"
                  >
                    {{ item.category }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-2xl text-slate-800">{{ item.qty }}</p>
                <p class="text-xs font-bold text-slate-400">{{ item.unit }}</p>
              </div>
            </div>
            <div class="flex gap-2 mt-2">
              <button
                @click="openRestock(item)"
                class="flex-1 bg-[#800020] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-100 hover:scale-105 transition"
              >
                + Restock
              </button>
              <button
                @click="handleConsume(item)"
                class="flex-1 bg-white border border-slate-200 text-slate-500 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                - Use
              </button>
            </div>
          </div>
        </div>

        <button
          @click="openAddForm"
          class="fixed bottom-8 right-8 w-16 h-16 bg-[#800020] text-white rounded-full shadow-2xl shadow-rose-300 flex items-center justify-center text-4xl hover:scale-110 transition z-40 border-4 border-white/20"
        >
          +
        </button>
      </div>

      <div
        v-if="currentTab === 'finance'"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div
          class="bg-[#800020] text-white p-8 rounded-[2.5rem] shadow-xl shadow-rose-200 relative overflow-hidden md:col-span-1"
        >
          <div
            class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"
          ></div>
          <p
            class="text-rose-200 text-xs uppercase font-bold tracking-widest mb-1"
          >
            Net Profit
          </p>
          <p class="text-5xl font-['Playfair_Display'] font-black">
            RM {{ (totalSales - totalExpenses).toFixed(2) }}
          </p>
          <div class="mt-8 pt-6 border-t border-white/10 space-y-2">
            <div class="flex justify-between text-sm">
              <span>Total Sales</span
              ><span class="font-bold">RM {{ totalSales }}</span>
            </div>
            <div class="flex justify-between text-sm text-rose-200">
              <span>Total Expenses</span
              ><span class="font-bold">- RM {{ totalExpenses }}</span>
            </div>
          </div>
        </div>

        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white md:col-span-2"
        >
          <div class="flex justify-between items-center mb-6">
            <h3
              class="font-['Playfair_Display'] font-bold text-xl text-[#800020]"
            >
              Expense Ledger
            </h3>
            <button
              @click="showExpenseModal = true"
              class="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200"
            >
              + Fee / Expense
            </button>
          </div>
          <div class="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            <div
              v-for="exp in expenses"
              :key="exp.id"
              class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group"
            >
              <div>
                <p class="font-bold text-slate-700">{{ exp.name }}</p>
                <p
                  class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                >
                  {{ exp.category }} •
                  {{
                    exp.date
                      ? new Date(exp.date.seconds * 1000).toLocaleDateString()
                      : "Today"
                  }}
                </p>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-mono font-bold text-red-400"
                  >- RM {{ exp.amount }}</span
                >
                <button
                  @click="deleteExpense(exp.id)"
                  class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentTab === 'history'" class="grid grid-cols-1 gap-6">
        <div
          class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white h-[70vh] overflow-y-auto"
        >
          <h3
            class="font-['Playfair_Display'] font-bold text-xl mb-6 text-[#800020]"
          >
            Order History
          </h3>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="text-xs text-slate-400 uppercase border-b border-slate-100"
              >
                <th class="pb-3 pl-4">ID</th>
                <th class="pb-3">Customer</th>
                <th class="pb-3">Items</th>
                <th class="pb-3">Total</th>
                <th class="pb-3">Status</th>
                <th class="pb-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in orders"
                :key="order.id"
                class="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td
                  class="py-4 pl-4 text-xs font-mono font-bold text-slate-400"
                >
                  #{{ order.queueNumber }}
                </td>
                <td class="py-4 text-sm font-bold text-slate-700">
                  {{ order.customerName || "Walk-in" }}
                </td>
                <td class="py-4 text-sm">
                  <div
                    v-for="(item, idx) in order.items"
                    :key="idx"
                    class="text-slate-600"
                  >
                    {{ item.name }}
                    <span class="text-slate-400 text-xs" v-if="item.qty > 1"
                      >x{{ item.qty }}</span
                    >
                  </div>
                </td>
                <td class="py-4 font-mono font-bold text-[#800020]">
                  RM{{ order.total }}
                </td>
                <td class="py-4">
                  <span
                    class="text-[10px] px-2 py-1 rounded-full font-bold uppercase"
                    :class="{
                      'bg-green-100 text-green-700':
                        order.status === 'completed' ||
                        order.status === 'ready',
                      'bg-yellow-100 text-yellow-700':
                        order.status === 'pending' ||
                        order.status === 'preparing',
                      'bg-gray-100 text-gray-500': order.status === 'void',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="py-4 text-right pr-4">
                  <button
                    @click="handleDeleteOrder(order.id)"
                    class="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold hover:bg-red-100 transition"
                  >
                    Void
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-if="currentTab === 'reviews'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-if="feedbacks.length === 0"
          class="col-span-full text-center py-20 opacity-50"
        >
          <div class="text-4xl mb-2">💬</div>
          <p class="font-bold text-slate-400">No reviews yet.</p>
        </div>
        <div
          v-for="fb in feedbacks"
          :key="fb.id"
          class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-white relative group hover:shadow-xl transition-all"
        >
          <button
            @click="deleteReview(fb.id)"
            class="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition hover:bg-red-100 hover:scale-110"
          >
            ✕
          </button>
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl shadow-inner"
            >
              <span class="text-2xl">{{ fb.avatar || "👤" }}</span>
            </div>
            <div>
              <p class="font-bold text-slate-800 text-lg leading-none">
                {{ fb.name }}
              </p>
              <p
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1"
              >
                {{
                  fb.timestamp
                    ? new Date(fb.timestamp.seconds * 1000).toLocaleDateString()
                    : "Just now"
                }}
              </p>
            </div>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            "{{ fb.message }}"
          </p>
          <div
            v-if="fb.imageUrl"
            class="rounded-2xl overflow-hidden mb-4 border border-slate-100"
          >
            <img :src="fb.imageUrl" class="w-full h-48 object-cover" />
          </div>
          <div
            class="flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-50 w-fit px-3 py-1 rounded-full"
          >
            <span>❤️</span> {{ fb.likes || 0 }} Likes
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showInventoryForm"
      class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/30 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full md:max-w-md p-8 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl animate-slide-up"
      >
        <div class="flex justify-between items-center mb-6">
          <h3
            class="font-['Playfair_Display'] font-bold text-2xl text-[#800020]"
          >
            {{ isEditing ? "Edit Details" : "New Item" }}
          </h3>
          <button
            @click="closeInventoryForm"
            class="bg-slate-100 text-slate-500 w-8 h-8 rounded-full font-bold hover:bg-slate-200"
          >
            ✕
          </button>
        </div>
        <div class="space-y-4">
          <input
            v-model="itemForm.name"
            placeholder="Item Name"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-slate-700"
          />
          <div class="flex gap-2">
            <button
              v-for="cat in invCategories"
              :key="cat"
              @click="itemForm.category = cat"
              :class="
                itemForm.category === cat
                  ? 'bg-[#800020] text-white'
                  : 'bg-slate-50 text-slate-400'
              "
              class="flex-1 py-3 rounded-xl text-xs font-bold transition-all"
            >
              {{ cat }}
            </button>
          </div>
          <div class="flex gap-4">
            <div class="w-1/2">
              <label
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-3 mb-1 block"
                >Initial Qty</label
              >
              <input
                v-model="itemForm.qty"
                type="number"
                class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 text-center font-bold"
              />
            </div>
            <div class="w-1/2">
              <label
                class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-3 mb-1 block"
                >Unit</label
              >
              <input
                v-model="itemForm.unit"
                placeholder="kg"
                class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 text-center font-bold"
              />
            </div>
          </div>
          <button
            @click="handleSaveInventory"
            class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-[#600015] mt-4"
          >
            Save Definition
          </button>
          <button
            v-if="isEditing"
            @click="handleDeleteInventory(itemForm.id)"
            class="w-full text-red-400 text-xs font-bold py-2 hover:text-red-600"
          >
            Delete Item Definition
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showRestockModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-slide-up"
      >
        <h3
          class="font-['Playfair_Display'] font-bold text-2xl text-[#800020] mb-1"
        >
          Restock Item
        </h3>
        <p
          class="text-xs text-slate-400 font-bold uppercase tracking-wider mb-6"
        >
          {{ selectedInvItem?.name }}
        </p>
        <div class="space-y-4">
          <div>
            <label
              class="text-[10px] font-bold text-slate-400 uppercase ml-3 mb-1 block"
              >Quantity Added</label
            >
            <div class="flex items-center gap-2">
              <input
                v-model="restockForm.qty"
                type="number"
                class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 text-center font-bold text-lg"
              />
              <span class="text-slate-400 font-bold text-sm">{{
                selectedInvItem?.unit
              }}</span>
            </div>
          </div>
          <div>
            <label
              class="text-[10px] font-bold text-slate-400 uppercase ml-3 mb-1 block"
              >Total Cost (RM)</label
            >
            <input
              v-model="restockForm.cost"
              type="number"
              placeholder="0.00"
              class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 text-center font-bold text-lg"
            />
            <p
              class="text-[10px] text-slate-400 mt-2 text-center leading-tight"
            >
              Increases stock & records expense.
            </p>
          </div>
          <div class="flex gap-2 mt-4">
            <button
              @click="showRestockModal = false"
              class="flex-1 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              @click="confirmRestock"
              class="flex-1 bg-[#800020] text-white py-3 rounded-xl font-bold shadow-lg shadow-rose-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showExpenseModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
    >
      <div
        class="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl animate-slide-up"
      >
        <h3
          class="font-['Playfair_Display'] font-bold text-2xl text-[#800020] mb-6"
        >
          Add Expense
        </h3>
        <div class="space-y-4">
          <input
            v-model="expenseForm.name"
            placeholder="Description (e.g. Booth Fee)"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold"
          />
          <select
            v-model="expenseForm.category"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold text-slate-500"
          >
            <option>Fees</option>
            <option>Utilities</option>
            <option>Salary</option>
            <option>Others</option>
          </select>
          <input
            v-model="expenseForm.amount"
            type="number"
            placeholder="Amount (RM)"
            class="w-full bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#800020]/20 font-bold"
          />
          <button
            @click="handleManualExpense"
            class="w-full bg-[#800020] text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 mt-2"
          >
            Save Expense
          </button>
          <button
            @click="showExpenseModal = false"
            class="w-full text-slate-400 font-bold py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAdminAuth } from "../composables/useAdminAuth";
import { useInventory } from "../composables/useInventory";
import { useRawInventory } from "../composables/useRawInventory";
import { useFinance } from "../composables/useFinance";
import { usePos } from "../composables/usePos";
import { useHistory } from "../composables/useHistory";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const currentTab = ref("pos");
const popup = ref({ show: false, title: "", message: "", type: "success" });
const feedbacks = ref([]);
const showMobileCart = ref(false); // New Mobile Cart Logic

// Modals
const showRestockModal = ref(false);
const showExpenseModal = ref(false);
const showInventoryForm = ref(false);
const selectedInvItem = ref(null);
const restockForm = ref({ qty: "", cost: "" });
const expenseForm = ref({ name: "", category: "Fees", amount: "" });

// Composables
const { isAuthenticated, handleLogin, logout, pinInput } = useAdminAuth();
const {
  totalSales,
  cart,
  totalItemsSold,
  addToCart,
  removeFromCart,
  cartTotal,
  processCheckout,
} = usePos();
const { orders, deleteOrder } = useHistory();
const { expenses, addExpense, deleteExpense, totalExpenses } = useFinance();
const {
  menu,
  categories: menuCats,
  filteredMenu,
  selectedCategory,
  newItem,
  previewImage,
  formMode,
  handleFileSelect,
  saveMenuItem,
  editItem,
  deleteItem,
  resetForm,
  updateStock,
  addCategory,
} = useInventory();
const {
  inventory,
  filteredInventory,
  categories: invCategories,
  selectedCategory: selectedInvCategory,
  itemForm,
  isEditing,
  editingId,
  saveItem: saveRawItem,
  deleteItem: deleteRawItem,
  adjustStock,
  openAddForm: openInvAdd,
  openEditForm: openInvEdit,
  closeForm: closeInvForm,
  totalInventoryValue,
} = useRawInventory();

// Wrapper functions
const openAddForm = () => {
  openInvAdd();
  showInventoryForm.value = true;
};
const openEditForm = (item) => {
  openInvEdit(item);
  showInventoryForm.value = true;
};
const closeInventoryForm = () => {
  closeInvForm();
  showInventoryForm.value = false;
};

// Reviews
onMounted(() => {
  const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"));
  onSnapshot(q, (snap) => {
    feedbacks.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });
});

const deleteReview = async (id) => {
  if (confirm("Permanently delete this review?")) {
    await deleteDoc(doc(db, "feedback", id));
    showPopup("Deleted", "Review removed.", "success");
  }
};

// Actions
const handleCreateCategory = async () => {
  const name = prompt("Enter new category name:");
  if (name) {
    await addCategory(name);
    showPopup("Category Added", `${name} is ready.`, "success");
  }
};

const handleCheckout = async () => {
  await processCheckout();
  showMobileCart.value = false; // Close mobile cart
  showPopup("Order Sent!", "Kitchen notified.", "success");
};

const handleSaveItem = async () => {
  await saveMenuItem();
  showPopup("Success", "Menu item saved.", "success");
};

const handleSaveInventory = async () => {
  await saveRawItem();
  closeInventoryForm();
  showPopup("Saved", "Inventory updated successfully.", "success");
};

const handleDeleteInventory = async (id) => {
  if (confirm("Delete this item definition?")) {
    await deleteRawItem(id);
    closeInventoryForm();
    showPopup("Deleted", "Item removed.", "success");
  }
};

const handleDeleteOrder = async (id) => {
  if (confirm("Void this order?")) {
    await deleteOrder(id, menu.value);
    showPopup("Voided", "Order deleted.", "success");
  }
};

const openRestock = (item) => {
  selectedInvItem.value = item;
  restockForm.value = { qty: "", cost: "" };
  showRestockModal.value = true;
};

const confirmRestock = async () => {
  if (!restockForm.value.qty || !restockForm.value.cost) return;
  await adjustStock(selectedInvItem.value.id, Number(restockForm.value.qty));
  await addExpense(
    `Restock: ${selectedInvItem.value.name}`,
    "Inventory",
    restockForm.value.cost,
  );
  showRestockModal.value = false;
  showPopup("Restocked", "Inventory updated & Expense recorded.", "success");
};

const handleConsume = async (item) => {
  const qty = prompt(`How much ${item.name} did you use?`);
  if (qty) {
    await adjustStock(item.id, -Number(qty));
    showPopup("Updated", "Stock count reduced.", "success");
  }
};

const handleManualExpense = async () => {
  if (!expenseForm.value.name || !expenseForm.value.amount) return;
  await addExpense(
    expenseForm.value.name,
    expenseForm.value.category,
    expenseForm.value.amount,
  );
  showExpenseModal.value = false;
  expenseForm.value = { name: "", category: "Fees", amount: "" };
  showPopup("Recorded", "Expense added to ledger.", "success");
};

const showPopup = (title, message, type) => {
  popup.value = { show: true, title, message, type };
  setTimeout(() => {
    popup.value.show = false;
  }, 2000);
};
</script>

<style>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
/* For mobile horizontal scrolling */
.snap-x {
  scroll-snap-type: x mandatory;
}
.snap-start {
  scroll-snap-align: start;
}
</style>
