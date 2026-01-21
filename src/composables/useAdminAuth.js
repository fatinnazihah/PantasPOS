import { ref, onMounted } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export function useAdminAuth() {
  const pinInput = ref("");
  const isAuthenticated = ref(false);

  onMounted(() => {
    auth.onAuthStateChanged((user) => (isAuthenticated.value = !!user));
  });

  const handleLogin = async () => {
    if (pinInput.value === "060704") {
      try {
        await signInWithEmailAndPassword(auth, "admin@kasmaran.com", "060704");
      } catch (e) {
        alert("Auth Error: Create admin user first.");
      }
    } else {
      alert("Wrong PIN");
    }
  };

  const logout = () => signOut(auth);

  return { pinInput, isAuthenticated, handleLogin, logout };
}