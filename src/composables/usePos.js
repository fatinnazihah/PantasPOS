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
      // Logic adjustment: Sum up qtys from items array if structured that way, 
      // otherwise just counting length is an approximation.
      totalItemsSold.value = snap.docs.length; 
    });
  });

  // --- FIXED ADD TO CART LOGIC (Grouping + Qty) ---
  const addToCart = (item) => {
    // 1. Check if item exists in cart
    const existingItem = cart.value.find((i) => i.id === item.id);

    if (existingItem) {
      // 2. If exists, check stock limit then increment qty
      if (existingItem.qty < item.dailyStock) {
        existingItem.qty++;
      } else {
        alert("Limit reached! You have all available stock in the cart.");
      }
    } else {
      // 3. If new, add to cart with qty: 1
      // Creating a copy {...item} is crucial so we don't mutate the original menu object
      if (item.dailyStock > 0) {
        cart.value.push({ ...item, qty: 1 });
      } else {
        alert("Item is Sold Out!");
      }
    }
  };

  const removeFromCart = (index) => {
    cart.value.splice(index, 1);
  };

  // --- FIXED TOTAL CALCULATION ---
  // Now uses item.price * item.qty
  const cartTotal = computed(() =>
    cart.value.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)
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
      return Math.floor(Math.random() * 1000); // Fallback
    }
  };

  const processCheckout = async () => {
    if (cart.value.length === 0) return false;

    // 1. Generate the Queue Number
    const queueNum = await getDailyQueueNumber();
    const todayStr = new Date().toISOString().split('T')[0];

    const newOrder = {
      items: cart.value, // Now contains { name, price, qty... }
      total: cartTotal.value,
      status: 'pending', // pending -> preparing -> ready -> completed
      paymentMethod: 'cash',
      timestamp: serverTimestamp(),
      
      // NEW FIELDS
      queueNumber: queueNum, 
      orderDate: todayStr, 
      customerName: "Walk-in" // Default for Admin POS
    };

    try {
      // 2. Save Order
      await addDoc(collection(db, 'orders'), newOrder);

      // 3. Deduct Stock immediately
      for (const item of cart.value) {
        await updateDoc(doc(db, "menu", item.id), {
          dailyStock: increment(-item.qty),
          stock: increment(-item.qty)
        });
      }

      cart.value = []; // Clear cart
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return { cart, totalSales, totalItemsSold, addToCart, removeFromCart, cartTotal, processCheckout };
}