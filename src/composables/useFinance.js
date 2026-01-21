import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";

export function useFinance() {
  const expenses = ref([]);

  onMounted(() => {
    const q = query(collection(db, "expenses"), orderBy("date", "desc"));
    onSnapshot(q, (snap) => {
      expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  });

  const addExpense = async (name, category, amount) => {
    await addDoc(collection(db, "expenses"), {
      name,
      category, 
      amount: Number(amount),
      date: serverTimestamp()
    });
  };

  const deleteExpense = async (id) => {
    // Removed confirm here too, keeping UI logic in the View
    await deleteDoc(doc(db, "expenses", id));
  };

  const totalExpenses = computed(() => 
    expenses.value.reduce((acc, item) => acc + (item.amount || 0), 0)
  );

  return { expenses, addExpense, deleteExpense, totalExpenses };
}