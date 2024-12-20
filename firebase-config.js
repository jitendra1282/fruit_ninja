import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save score to Firebase
async function saveScore(username, score) {
  try {
    await addDoc(collection(db, 'scores'), { username, score });
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

// Load leaderboard
async function loadLeaderboard() {
  const querySnapshot = await getDocs(collection(db, 'scores'));
  const scores = [];
  querySnapshot.forEach(doc => scores.push(doc.data()));
  scores.sort((a, b) => b.score - a.score);

  const scoresList = document.getElementById('scores');
  scoresList.innerHTML = '';
  scores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.username}: ${score.score}`;
    scoresList.appendChild(li);
  });
}
loadLeaderboard();