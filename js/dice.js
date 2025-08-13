const diceToggle = document.getElementById("diceToggle");
const dicePage = document.getElementById("dicePage");

const histToggle = document.getElementById("histToggle");
const historySection = document.getElementById("historySection");
const clearHistoryButton = document.getElementById("clearHistoryButton");

const diceSection = document.getElementById("diceSection");
const rollButton = document.getElementById("rollButton");

const addD20Button = document.getElementById("addD20Button");
const addD12Button = document.getElementById("addD12Button");
const addD10Button = document.getElementById("addD10Button");
const addDPercentButton = document.getElementById("addDPercentButton");
const addD8Button = document.getElementById("addD8Button");
const addD6Button = document.getElementById("addD6Button");
const addD4Button = document.getElementById("addD4Button");

let rollHistory = [];
let diceOpen = true;
let histOpen = true;
let isRolling = false;
let activeResultsPanels = [];

const diceTypes = {
  20: { max: 20, url: "../assets/images/d20.svg" },
  12: { max: 12, url: "../assets/images/d12.svg" },
  10: { max: 10, url: "../assets/images/d10.svg" },
  "%": { max: 10, url: "../assets/images/d10.svg" },
  8: { max: 8, url: "../assets/images/d8.svg" },
  6: { max: 6, url: "../assets/images/d6.svg" },
  4: { max: 4, url: "../assets/images/d4.svg" },
};

// Dice Rolling and Results
async function rollDice() {
  isRolling = true;
  rollButton.disabled = true;
  const diceH1s = diceSection.querySelectorAll("h1[data-die-type]");
  let results = [];
  let dice = [];

  diceH1s.forEach((h1) => {
    if (h1.parentElement) {
      h1.parentElement.classList.add("diceRolling");
    }
  });

  for (let i = 0; i < 70; i++) {
    await new Promise((resolve) => setTimeout(resolve, i));
    diceH1s.forEach((h1, idx) => {
      const type = h1.dataset.dieType;

      if (diceTypes[type]) {
        let roll;
        if (type === "%") {
          roll = Math.floor(Math.random() * 10);
        } else {
          roll = Math.floor(Math.random() * diceTypes[type].max) + 1;
        }
        h1.textContent =
          type === "%" ? (roll * 10).toString().padStart(2, "0") : roll;
        if (i === 69) {
          results[idx] = type === "%" ? roll * 10 : roll;
          dice[idx] = type;
        }
      }
    });
  }

  diceH1s.forEach((h1) => {
    if (h1.parentElement) {
      h1.parentElement.classList.remove("diceRolling");
    }
  });

  isRolling = false;
  rollButton.disabled = false;

  const total = results.reduce((a, b) => a + b, 0);

  activeResultsPanels.forEach((panel) => {
    panel.className = "resultsPanel condensed visible";
    const resultsValue =
      panel.querySelector(".resultsValue")?.textContent ||
      panel
        .querySelector(".condensedTotal")
        ?.textContent?.replace("Total: ", "") ||
      "0";
    panel.innerHTML = `<div class="condensedTotal">Total: ${resultsValue}</div>`;
  });

  const diceResults = { dice, results };
  createResultsPanel(diceResults, total, true);

  rollHistory.push({
    date: new Date().toISOString(),
    dice: dice.slice(),
    results: results.slice(),
    total: total,
  });
  localStorage.setItem("diceRollHistory", JSON.stringify(rollHistory));
  renderHistory();
}

// Dice Creation and Management
function createDiceDiv(type) {
  const config = diceTypes[type];
  if (!config) return null;

  const div = document.createElement("div");
  div.classList.add("dice");
  div.style.position = "relative";

  const bgDiv = document.createElement("div");
  bgDiv.classList.add("diceBG");
  bgDiv.style.background = "";
  bgDiv.style.setProperty("--mask-url", `url('${config.url}')`);

  const h1 = document.createElement("h1");
  h1.textContent = "0";
  h1.dataset.dieType = type;

  div.appendChild(bgDiv);
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

// Results Panel
function createResultsPanel(diceResults, total, isLatest = true) {
  const diceGroups = {};
  diceResults.dice.forEach((die, index) => {
    if (!diceGroups[die]) {
      diceGroups[die] = {
        count: 0,
        results: [],
      };
    }
    diceGroups[die].count++;
    diceGroups[die].results.push(diceResults.results[index]);
  });

  const diceInfo = Object.keys(diceGroups)
    .sort((a, b) => b - a)
    .map((die) => `${diceGroups[die].count}d${die}`)
    .join(" + ");

  const individualRolls = diceResults.results.join("+");

  const panel = document.createElement("div");
  panel.className = isLatest ? "resultsPanel" : "resultsPanel condensed";

  if (isLatest) {
    panel.innerHTML = `
      <div class="resultsLabel">Total</div>
      <div class="resultsValue">${total}</div>
      <div class="diceInfo">${diceInfo}</div>
      <div class="individualRolls">${individualRolls}</div>
    `;
  } else {
    panel.innerHTML = `
      <div class="condensedTotal">Total: ${total}</div>
    `;
  }

  if (!document.getElementById("resultsContainer")) {
    const container = document.createElement("div");
    container.id = "resultsContainer";
    document.body.appendChild(container);
  }

  document.getElementById("resultsContainer").appendChild(panel);
  activeResultsPanels.push(panel);

  setTimeout(() => {
    panel.classList.add("visible");
  }, 50);

  setTimeout(() => {
    removeResultsPanel(panel);
  }, 8000);

  return panel;
}

function removeResultsPanel(panel) {
  panel.classList.remove("visible");
  setTimeout(() => {
    if (panel.parentNode) {
      panel.parentNode.removeChild(panel);
    }
    const index = activeResultsPanels.indexOf(panel);
    if (index > -1) {
      activeResultsPanels.splice(index, 1);
    }
  }, 400);
}

// History
if (localStorage.getItem("diceRollHistory")) {
  rollHistory = JSON.parse(localStorage.getItem("diceRollHistory"));
}

function renderHistory() {
  if (!historySection) return;
  historySection.innerHTML = "";

  const typeDisplay = (type) => (type === "%" ? "d%" : `d${type}`);

  rollHistory.forEach((entry, idx) => {
    const item = document.createElement("h1");
    item.textContent = `Roll ${idx + 1}: Dice [${entry.dice
      .map(typeDisplay)
      .join(", ")}], Results [${entry.results.join(", ")}], Total: ${
      entry.total
    }`;
    historySection.appendChild(item);
  });

  updateHistoryButtons();
}

function clearHistory() {
  localStorage.removeItem("diceRollHistory");
  rollHistory = [];
  renderHistory();
  updateHistoryButtons();
  activeResultsPanels.forEach((panel) => removeResultsPanel(panel));
}

// UI Toggles
async function diceToggleFunc() {
  if (diceOpen === false) {
    dicePage.style.visibility = "visible";
    dicePage.style.opacity = "1";
    dicePage.style.pointerEvents = "auto";
    diceOpen = true;
  } else if (diceOpen === true) {
    dicePage.style.opacity = "0";
    dicePage.style.pointerEvents = "none";
    await new Promise((resolve) => setTimeout(resolve, 300));
    dicePage.style.visibility = "hidden";

    while (diceSection.firstChild) {
      diceSection.removeChild(diceSection.firstChild);
    }
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

// Button Updates
function updateDiceButtons() {
  const hasDice = diceSection.querySelectorAll(".dice").length > 0;
  rollButton.disabled = !hasDice;
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
addDPercentButton.onclick = () => addDice("%");
addD8Button.onclick = () => addDice(8);
addD6Button.onclick = () => addDice(6);
addD4Button.onclick = () => addDice(4);

diceToggleFunc();
histToggleFunc();
renderHistory();
updateDiceButtons();
