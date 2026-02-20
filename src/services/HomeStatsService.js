import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { auth } from "../firebase/FirebaseConfig";

export async function getHomeStats() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const resumosQuery = query(
    collection(db, "Resumos"),
    where("uid", "==", user.uid)
  );

  const flashcardsQuery = query(
    collection(db, "Flashcards"),
    where("uid", "==", user.uid)
  );

  const [resumosSnap, flashcardsSnap] = await Promise.all([
    getCountFromServer(resumosQuery),
    getCountFromServer(flashcardsQuery),
  ]);

  return {
    resumos: resumosSnap.data().count,
    flashcards: flashcardsSnap.data().count,
  };
}
