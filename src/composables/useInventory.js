import { ref, computed, onMounted } from "vue";
import { db, storage } from "../firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, increment, query, orderBy } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export function useInventory() {
  const menu = ref([]);
  const categories = ref([]);
  const formMode = ref("add");
  const editingId = ref(null);
  
  // ADDED: description field
  const newItem = ref({ 
    name: "", 
    price: "", 
    stock: "", 
    dailyStock: "", 
    category: "", 
    description: "", 
    file: null 
  });
  
  const previewImage = ref(null);
  const selectedCategory = ref("all");

  onMounted(() => {
    onSnapshot(collection(db, "menu"), (snap) => {
      menu.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    });

    const catQuery = query(collection(db, "categories"), orderBy("name", "asc"));
    onSnapshot(catQuery, (snap) => {
      categories.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    });
  });

  const addCategory = async (name) => {
    if(!name) return;
    if(categories.value.some(c => c.name.toLowerCase() === name.toLowerCase())) return alert("Category exists");
    await addDoc(collection(db, "categories"), { name: name });
  };

  const filteredMenu = computed(() => {
    if (selectedCategory.value === 'all') return menu.value;
    return menu.value.filter(item => item.category === selectedCategory.value);
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      newItem.value.file = file;
      previewImage.value = URL.createObjectURL(file);
    }
  };

  const saveMenuItem = async () => {
    let imageUrl = newItem.value.imageUrl || ""; 
    
    if (newItem.value.file) {
      const fileRef = storageRef(storage, `menu/${Date.now()}_${newItem.value.file.name}`);
      await uploadBytes(fileRef, newItem.value.file);
      imageUrl = await getDownloadURL(fileRef);
    }

    const payload = {
      name: newItem.value.name,
      price: Number(newItem.value.price),
      stock: Number(newItem.value.stock),
      dailyStock: Number(newItem.value.dailyStock),
      category: newItem.value.category || "General",
      description: newItem.value.description || "", // ADDED: Save description
      imageUrl,
    };

    if (formMode.value === 'edit' && editingId.value) {
      await updateDoc(doc(db, "menu", editingId.value), payload);
    } else {
      await addDoc(collection(db, "menu"), payload);
    }

    resetForm();
  };

  const editItem = (item) => {
    formMode.value = 'edit';
    editingId.value = item.id;
    // ADDED: Load existing description
    newItem.value = { 
      ...item, 
      description: item.description || "", 
      file: null 
    }; 
    previewImage.value = item.imageUrl;
  };

  const deleteItem = async (id) => {
    if(confirm("Delete this menu item?")) {
      await deleteDoc(doc(db, "menu", id));
    }
  };

  const resetForm = () => {
    formMode.value = 'add';
    editingId.value = null;
    // ADDED: Reset description
    newItem.value = { 
      name: "", 
      price: "", 
      stock: "", 
      dailyStock: "", 
      category: "", 
      description: "", 
      file: null 
    };
    previewImage.value = null;
  };

  const updateStock = async (id, field, amount) => {
    await updateDoc(doc(db, "menu", id), { [field]: increment(amount) });
  };

  return { 
    menu, categories, filteredMenu, selectedCategory, newItem, previewImage, formMode, 
    handleFileSelect, saveMenuItem, editItem, deleteItem, resetForm, updateStock, addCategory 
  };
}