import { ref, onMounted } from "vue";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore";

export function useHistory() {
  const orders = ref([]);

  onMounted(() => {
    // Get orders sorted by newest first
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snap) => {
      // The ID is explicitly included here
      orders.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  });

  // RE-WRITTEN DELETE TO HANDLE STOCK RESTORE SAFELY
  // We need to fetch all menu items to match names/IDs
  const deleteOrder = async (orderId, menuItems) => {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;
    
    const orderData = orderSnap.data();

    // Restore Stock
    if (menuItems && orderData.items && Array.isArray(orderData.items)) {
      // Use for...of loop to handle async/await correctly
      for (const orderItem of orderData.items) {
        // orderItem is an object: { id: "...", name: "..." }
        // Find matching menu item from the list passed in
        const menuItem = menuItems.find(m => m.id === orderItem.id || m.name === orderItem.name);
        
        if (menuItem) {
          await updateDoc(doc(db, "menu", menuItem.id), {
             stock: increment(1),
             dailyStock: increment(1)
          });
        }
      }
    }

    await deleteDoc(orderRef);
  };

  return { orders, deleteOrder };
}