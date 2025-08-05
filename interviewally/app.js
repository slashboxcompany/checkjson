const wrapper = document.getElementById("wrapper");
const splashScreen = document.getElementById("splash-screen");
const loadingText = document.getElementById("loading-text");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const uniqueRand = (min, max, prev) => {
  let next = prev;
  
  while(prev === next) next = rand(min, max);
  
  return next;
}

const combinations = [
  { configuration: 1, roundness: 1 },
  { configuration: 1, roundness: 2 },
  { configuration: 1, roundness: 4 },
  { configuration: 2, roundness: 2 },
  { configuration: 2, roundness: 3 },
  { configuration: 3, roundness: 3 }
];

let prev = 0;

// Shape animation interval
const shapeInterval = setInterval(() => {
  const index = uniqueRand(0, combinations.length - 1, prev),
        combination = combinations[index];
  
  wrapper.dataset.configuration = combination.configuration;
  wrapper.dataset.roundness = combination.roundness;
  
  prev = index;
}, 800);

// Loading text animation
const loadingMessages = [
  "Loading...",
  "Real-time problem solving...",
  "Secure & private mode...",
  "Natural command shortcuts...",
  "DSA problem database...",
  "Screenshot analysis...",
  "Step-by-step explanations...",
  "Undetectable features...",
  "Almost ready to ace your interview..."
];

let messageIndex = 0;
const textInterval = setInterval(() => {
  messageIndex = (messageIndex + 1) % loadingMessages.length;
  loadingText.textContent = loadingMessages[messageIndex];
}, 800);

// Splash screen transition
setTimeout(() => {
  // Clear intervals
  clearInterval(shapeInterval);
  clearInterval(textInterval);
  
  // Start fade out
  splashScreen.classList.add('fade-out');
  
  // After fade out completes, redirect directly to website
  setTimeout(() => {
    window.location.href = 'https://interviewally.tech';
  }, 1000);
}, 5000); // Show splash for 4 seconds