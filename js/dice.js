const diceSection = document.getElementById('diceSection');
const addButton = document.getElementById('addButton');
const rollButton = document.getElementById('rollButton');
const removeButton = document.getElementById('removeButton');

const diceTypes = {
    20: { max: 20, url: 'assets/images/d20.svg' },
    12: { max: 12, url: 'assets/images/d12.svg' },
    10: { max: 10, url: 'assets/images/d10.svg' },
    8:  { max: 8,  url: 'assets/images/d8.svg' },
    6:  { max: 6,  url: 'assets/images/d6.svg' },
    4:  { max: 4,  url: 'assets/images/d4.svg' },
    100:{ max: 100,url: 'assets/images/d100.svg' }
};

function createDiceDiv(type) {
    const config = diceTypes[type];
    if (!config) return null;

    const div = document.createElement('div');
    div.classList.add('dice');

    const h1 = document.createElement('h1');
    h1.textContent = '0';
    h1.dataset.dieType = type;
    h1.style.backgroundImage = `url('${config.url}')`;

    div.appendChild(h1);
    return div;
}


function addDice() {
    let typeStr = prompt("Enter dice type to add (20, 12, 10, 8, 6, 4, 100):");
    if (!typeStr) return;

    typeStr = typeStr.trim();
    const type = parseInt(typeStr, 10);

    if (!diceTypes.hasOwnProperty(type)) {
        alert("Invalid dice type! Please enter one of 20, 12, 10, 8, 6, 4, 100.");
        return;
    }

    const newDice = createDiceDiv(type);
    if (newDice) {
        diceSection.appendChild(newDice);
        updateButtonState();
    }
}

function removeDice() {
    const diceElements = diceSection.querySelectorAll('.dice');
    if (diceElements.length === 0) return;

    diceSection.removeChild(diceElements[diceElements.length - 1]);
    updateButtonState();
}

function updateButtonState() {
    const hasDice = diceSection.querySelectorAll('.dice').length > 0;
    rollButton.disabled = !hasDice; removeButton.disabled = !hasDice;
}

async function rollDice() {
    const diceH1s = diceSection.querySelectorAll('h1[data-die-type]');
    if (diceH1s.length === 0) return;

    for (let i = 0; i < 70; i++) {
        await new Promise(resolve => setTimeout(resolve, i));
        diceH1s.forEach(h1 => {
        const type = parseInt(h1.dataset.dieType, 10);
        if (diceTypes[type]) {
            const roll = Math.floor(Math.random() * diceTypes[type].max) + 1;
            h1.textContent = roll;
        }
        });
    }
}

addButton.onclick = addDice;
removeButton.onclick = removeDice;
rollButton.onclick = rollDice;

updateButtonState();
