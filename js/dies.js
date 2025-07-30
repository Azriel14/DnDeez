const d20Output = document.getElementById('d20Output');
const d12Output = document.getElementById('d12Output');
const d8Output = document.getElementById('d8Output');
const d6Output = document.getElementById('d6Output');
const d4Output = document.getElementById('d4Output');
const d100Output = document.getElementById('d100Output');

const diceShape = document.getElementById('diceShape');

const removeButton = document.getElementById('removeButton');
const rollButton = document.getElementById('rollButton');
const addButton = document.getElementById('addButton');

const dice = [
    { max: 20, output: d20Output, enabled: true },
    { max: 12, output: d12Output, enabled: true },
    { max: 8, output: d8Output, enabled: true },
    { max: 6, output: d6Output, enabled: true },
    { max: 4, output: d4Output, enabled: true },
    { max: 100, output: d100Output, enabled: true }
];

function updateDiceVisibility() {
    dice.forEach(die => {
        if (die.output) {
            const container = die.output.parentElement;
            if (container) {
                container.style.display = die.enabled ? 'flex' : 'none';
            }
        }
    });
    
    const enabledCount = dice.filter(die => die.enabled).length;
    removeButton.disabled = enabledCount <= 0;
    addButton.disabled = enabledCount >= dice.length;
}

addButton.onclick = function() {
    const disabledDie = dice.find(die => !die.enabled);
    if (disabledDie) {
        disabledDie.enabled = true;
        updateDiceVisibility();
    }
};

removeButton.onclick = function() {
    for (let i = dice.length - 1; i >= 0; i--) {
        if (dice[i].enabled) {
            dice[i].enabled = false;
            break;
        }
    }
    updateDiceVisibility();
};

function random(max) {
    return Math.floor(Math.random() * max) + 1;
}

rollButton.onclick = async function rollDice() {
    for (let i = 0; i < 35; i++) {
        await new Promise(resolve => setTimeout(resolve, 25));
        dice.forEach(die => {
            if (die.output && die.enabled) {
                const result = random(die.max);
                die.output.textContent = result;
            }
        });
    }
};

updateDiceVisibility();