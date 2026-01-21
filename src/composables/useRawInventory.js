import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, increment } from "firebase/firestore";

export function useRawInventory() {
  const inventory = ref([]);
  const showForm = ref(false); 
  const isEditing = ref(false);
  const editingId = ref(null);
  
  // Data Model
  const itemForm = ref({ name: '', category: 'Ingredients', qty: 0, unit: '' }); // Removed 'cost' from base definition

  const categories = ["Ingredients", "Packaging", "Others"];
  const selectedCategory = ref("All");

  onMounted(() => {
    const q = query(collection(db, "inventory"), orderBy("name", "asc"));
    onSnapshot(q, (snap) => {
      inventory.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    });
  });

  // 1. CREATE ITEM (Definition only)
  const saveItem = async () => {
    const payload = {
      name: itemForm.value.name,
      category: itemForm.value.category,
      qty: Number(itemForm.value.qty), 
      unit: itemForm.value.unit,
    };

    if (isEditing.value && editingId.value) {
      await updateDoc(doc(db, "inventory", editingId.value), payload);
    } else {
      await addDoc(collection(db, "inventory"), payload);
    }
    closeForm();
    return true;
  };

  // 2. UPDATE STOCK LEVEL
  const adjustStock = async (id, amount) => {
    await updateDoc(doc(db, "inventory", id), { qty: increment(amount) });
  };

  // 3. DELETE ITEM
  // Removed 'confirm' here to handle it in the UI instead
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "inventory", id));
  };

  // Helper Functions
  const openAddForm = () => {
    isEditing.value = false;
    itemForm.value = { name: '', category: 'Ingredients', qty: 0, unit: '' };
    showForm.value = true;
  };

  const openEditForm = (item) => {
    isEditing.value = true;
    editingId.value = item.id;
    itemForm.value = { ...item };
    showForm.value = true;
  };

  const closeForm = () => {
    showForm.value = false;
    itemForm.value = { name: '', category: 'Ingredients', qty: 0, unit: '' };
  };

  const filteredInventory = computed(() => {
    if (selectedCategory.value === 'All') return inventory.value;
    return inventory.value.filter(i => i.category === selectedCategory.value);
  });

  // Calculate Asset Value (Optional: estimate value based on last known cost if you track it, otherwise 0)
  const totalInventoryValue = computed(() => 0); // Placeholder if you aren't tracking unit cost per item

  return { 
    inventory, filteredInventory, categories, selectedCategory, 
    itemForm, showForm, isEditing, editingId,
    saveItem, deleteItem, adjustStock, openAddForm, openEditForm, closeForm, totalInventoryValue
  };
}