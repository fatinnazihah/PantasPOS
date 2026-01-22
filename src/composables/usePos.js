import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  increment, 
  onSnapshot, 
  runTransaction, 
  serverTimestamp 
} from "firebase/firestore";

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

  // Helper: Generates a 1-up number that resets daily
    const getDailyQueueNumber = async () => {
    const todayStr = new Date().toISOString().split('T')[0]; // "2025-01-22"
    const counterRef = doc(db, 'counters', 'daily_queue'); // Dedicated counter doc

    try {
        const newQ = await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(counterRef);
        
        let nextNum = 1;
        
        if (sfDoc.exists()) {
            const data = sfDoc.data();
            // If the date stored matches today, increment. Otherwise, reset to 1.
            if (data.date === todayStr) {
            nextNum = data.current + 1;
            }
        }

        // Update the counter doc
        transaction.set(counterRef, { 
            current: nextNum, 
            date: todayStr 
        });

        return nextNum;
        });
        return newQ;
    } catch (e) {
        console.error("Queue Gen Error:", e);
        return null; // Fallback
    }
    };

  const processCheckout = async () => {
    if (cart.value.length === 0) return false;

    // 1. Generate the Queue Number
    const queueNum = await getDailyQueueNumber();
    const todayStr = new Date().toISOString().split('T')[0];

    const newOrder = {
        items: cart.value,
        total: cartTotal.value,
        status: 'pending', // pending -> preparing -> ready -> completed
        paymentMethod: 'cash',
        timestamp: serverTimestamp(),
        
        // NEW FIELDS
        queueNumber: queueNum, 
        orderDate: todayStr, // Helps us filter "today's" orders
    };

    try {
        await addDoc(collection(db, 'orders'), newOrder);
        cart.value = []; // Clear cart
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
    };

  return { cart, totalSales, totalItemsSold, addToCart, removeFromCart, cartTotal, processCheckout };

}