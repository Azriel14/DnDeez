const diceToggle = document.getElementById("diceToggle");
const dicePage = document.getElementById("dicePage");

const histToggle = document.getElementById("histToggle");
let rollHistory = [];
const historySection = document.getElementById("historySection");
const clearHistoryButton = document.getElementById("clearHistoryButton");

let diceOpen = true;
let histOpen = true;

const diceSection = document.getElementById("diceSection");
const rollButton = document.getElementById("rollButton");
const totalText = document.getElementById("totalText");

const addD20Button = document.getElementById("addD20Button");
const addD12Button = document.getElementById("addD12Button");
const addD10Button = document.getElementById("addD10Button");
const addD8Button = document.getElementById("addD8Button");
const addD6Button = document.getElementById("addD6Button");
const addD4Button = document.getElementById("addD4Button");
const addD100Button = document.getElementById("addD100Button");

const diceTypes = {
  20: { max: 20, url: "assets/images/d20.svg" },
  12: { max: 12, url: "assets/images/d12.svg" },
  10: { max: 10, url: "assets/images/d10.svg" },
  100: { max: 10, url: "assets/images/d10.svg" },
  8: { max: 8, url: "assets/images/d8.svg" },
  6: { max: 6, url: "assets/images/d6.svg" },
  4: { max: 4, url: "assets/images/d4.svg" },
};

let isRolling = false;

function createDiceDiv(type) {
  const config = diceTypes[type];
  if (!config) return null;

  const div = document.createElement("div");
  div.classList.add("dice");

  const h1 = document.createElement("h1");
  h1.textContent = "0";
  h1.dataset.dieType = type;
  h1.style.backgroundImage = `url('${config.url}')`;

  div.appendChild(h1);

  div.addEventListener("click", () => {
    if (isRolling) return;
    div.remove();
    updateDiceButtons();
  });

  return div;
}

function addDice(type) {
  const newDice = createDiceDiv(type);
  if (newDice) {
    diceSection.appendChild(newDice);
    updateDiceButtons();
  }
}

function updateDiceButtons() {
  const hasDice = diceSection.querySelectorAll(".dice").length > 0;
  rollButton.disabled = !hasDice;
}

async function rollDice() {
  isRolling = true;
  rollButton.disabled = true;
  const diceH1s = diceSection.querySelectorAll("h1[data-die-type]");
  let results = [];
  let dice = [];
  for (let i = 0; i < 70; i++) {
    await new Promise((resolve) => setTimeout(resolve, i));
    diceH1s.forEach((h1, idx) => {
      const type = parseInt(h1.dataset.dieType, 10);
      if (diceTypes[type]) {
        let roll;
        if (type === 100) {
          roll = Math.floor(Math.random() * 10);
        } else {
          roll = Math.floor(Math.random() * diceTypes[type].max) + 1;
        }
        h1.textContent =
          type === 100 ? (roll * 10).toString().padStart(2, "0") : roll;
        if (i === 69) {
          results[idx] = type === 100 ? roll * 10 : roll;
          dice[idx] = type;
        }
      }
    });
  }
  isRolling = false;
  rollButton.disabled = false;

  const total = results.reduce((a, b) => a + b, 0);
  totalText.textContent = total;

  rollHistory.push({
    date: new Date().toISOString(),
    dice: dice.slice(),
    results: results.slice(),
    total: total,
  });
  localStorage.setItem("diceRollHistory", JSON.stringify(rollHistory));
  renderHistory();
}

function diceToggleFunc() {
  if (diceOpen === false) {
    dicePage.style.display = "block";
    diceOpen = true;
  } else if (diceOpen === true) {
    dicePage.style.display = "none";

    while (diceSection.firstChild) {
      diceSection.removeChild(diceSection.firstChild);
    }

    totalText.textContent = "";
    diceOpen = false;

    updateDiceButtons();
  }
}

function histToggleFunc() {
  if (histOpen === false) {
    historySection.style.display = "block";
    histOpen = true;
  } else if (histOpen === true) {
    historySection.style.display = "none";
    histOpen = false;
  }
}

function clearHistory() {
  localStorage.removeItem("diceRollHistory");
  rollHistory = [];
  renderHistory();
  updateHistoryButtons();
}

if (localStorage.getItem("diceRollHistory")) {
  rollHistory = JSON.parse(localStorage.getItem("diceRollHistory"));
}

function renderHistory() {
  if (!historySection) return;
  historySection.innerHTML = "";
  rollHistory.forEach((entry, idx) => {
    const item = document.createElement("h1");
    item.textContent = `Roll ${idx + 1}: Dice [${entry.dice.join(
      ", "
    )}], Results [${entry.results.join(", ")}], Total: ${entry.total}`;
    historySection.appendChild(item);
  });
  updateHistoryButtons();
}

function updateHistoryButtons() {
  const hasHistory = rollHistory.length > 0;
  if (histToggle) histToggle.disabled = !hasHistory;
  if (clearHistoryButton) clearHistoryButton.disabled = !hasHistory;
}

diceToggle.onclick = diceToggleFunc;
histToggle.onclick = histToggleFunc;
clearHistoryButton.onclick = clearHistory;
rollButton.onclick = rollDice;

addD20Button.onclick = () => addDice(20);
addD12Button.onclick = () => addDice(12);
addD10Button.onclick = () => addDice(10);
addD100Button.onclick = () => addDice(100);
addD8Button.onclick = () => addDice(8);
addD6Button.onclick = () => addDice(6);
addD4Button.onclick = () => addDice(4);

diceToggleFunc();
histToggleFunc();
renderHistory();
updateDiceButtons();
