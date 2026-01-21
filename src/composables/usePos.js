import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc, increment, onSnapshot, serverTimestamp } from "firebase/firestore";

export function usePos() {
  const cart = ref([]);
  const totalSales = ref(0);
  const totalItemsSold = ref(0);

  // Listen to Sales Stats
  onMounted(() => {
    onSnapshot(collection(db, "orders"), (snap) => {
      totalSales.value = snap.docs.reduce((acc, curr) => acc + curr.data().total, 0);
      totalItemsSold.value = snap.docs.reduce((acc, curr) => acc + curr.data().items.length, 0);
    });
  });

  // --- FIXED ADD TO CART LOGIC ---
  const addToCart = (item) => {
    // 1. First check: Is the item visibly out of stock?
    if (item.dailyStock <= 0) {
      return alert("Item is Sold Out!");
    }

    // 2. Second check: Do we already have all available stock in the cart?
    // We count how many of this item ID are already in the cart array
    const countInCart = cart.value.filter(cartItem => cartItem.id === item.id).length;

    if (countInCart >= item.dailyStock) {
      return alert("Limit reached! You have all available stock in the cart.");
    }

    // 3. Safe to add
    cart.value.push(item);
  };

  const removeFromCart = (index) => cart.value.splice(index, 1);

  const cartTotal = computed(() =>
    cart.value.reduce((acc, item) => acc + Number(item.price), 0)
  );

  const processCheckout = async () => {
    if (cart.value.length === 0) return;

    // 1. Create Order
    await addDoc(collection(db, "orders"), {
      items: cart.value.map((i) => i.name),
      total: cartTotal.value,
      status: "pending",
      timestamp: serverTimestamp(),
      date: new Date().toLocaleDateString('en-GB')
    });

    // 2. Decrement Stock in Database
    // We use a Map to handle duplicates efficiently (e.g. if you sold 3x Cookies)
    const itemCounts = {};
    cart.value.forEach(item => {
      itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
    });

    for (const [id, count] of Object.entries(itemCounts)) {
      await updateDoc(doc(db, "menu", id), {
        stock: increment(-count),      // Reduce Total Stock
        dailyStock: increment(-count)  // Reduce Daily Stock
      });
    }

    cart.value = [];
  };

  return { cart, totalSales, totalItemsSold, addToCart, removeFromCart, cartTotal, processCheckout };
}