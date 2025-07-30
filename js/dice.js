const diceToggle = document.getElementById('diceToggle');
const dicePage = document.getElementById('dicePage');

let diceOpen = true;

const diceSection = document.getElementById('diceSection');
const rollButton = document.getElementById('rollButton');
const removeButton = document.getElementById('removeButton');
const totalText = document.getElementById('totalText');

const addD20Button = document.getElementById('addD20Button');
const addD12Button = document.getElementById('addD12Button');
const addD10Button = document.getElementById('addD10Button');
const addD8Button = document.getElementById('addD8Button');
const addD6Button = document.getElementById('addD6Button');
const addD4Button = document.getElementById('addD4Button');
const addD100Button = document.getElementById('addD100Button');

const diceTypes = {
    20: { max: 20, url: 'assets/images/d20.svg' },
    12: { max: 12, url: 'assets/images/d12.svg' },
    10: { max: 10, url: 'assets/images/d10.svg' },
    8:  { max: 8,  url: 'assets/images/d8.svg' },
    6:  { max: 6,  url: 'assets/images/d6.svg' },
    4:  { max: 4,  url: 'assets/images/d4.svg' },
    100:{ max: 100,url: 'assets/images/d100.svg' }
};

const wildMagicSurgeText = document.getElementById("wildMagicSurgeText");

const wildMagicSurgeEffects = [
    { range: [1, 4], text: `Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls.` },
    { range: [5, 8], text: `A creature that is Friendly toward you appears in a random unoccupied space within 60 feet of you. The creature is under the DM’s control and disappears 1 minute later. Roll 1d4 to determine the creature: on a 1, a Modron Duodrone appears; on a 2, a Flumph appears; on a 3, a Modron Monodrone appears; on a 4, a Unicorn appears. See the Monster Manual for the creature’s stat block.` },
    { range: [9, 12], text: `For the next minute, you regain 5 Hit Points at the start of each of your turns.` },
    { range: [13, 16], text: `Creatures have Disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw.` },
    { range: [17, 20], text: `You are subjected to an effect that lasts for 1 minute unless its description says otherwise. Roll 1d8 to determine the effect:
    1: You’re surrounded by faint, ethereal music only you and creatures within 5 feet of you can hear.
    2: Your size increases by one size category.
    3: You grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode from your face and vanish.
    4: You must shout when you speak.
    5: Illusory butterflies flutter in the air within 10 feet of you.
    6: An eye appears on your forehead, granting you Advantage on Wisdom (Perception) checks.
    7: Pink bubbles float out of your mouth whenever you speak.
    8: Your skin turns a vibrant shade of blue for 24 hours or until the effect is ended by a Remove Curse spell.` },
    { range: [21, 24], text: `For the next minute, all your spells with a casting time of an action have a casting time of a Bonus Action.` },
    { range: [25, 28], text: `You are transported to the Astral Plane until the end of your next turn. You then return to the space you previously occupied or the nearest unoccupied space if that space is occupied.` },
    { range: [29, 32], text: `The next time you cast a spell that deals damage within the next minute, don’t roll the spell’s damage dice for the damage. Instead, use the highest number possible for each damage die.` },
    { range: [33, 36], text: `You have Resistance to all damage for the next minute.` },
    { range: [37, 40], text: `You turn into a potted plant until the start of your next turn. While you’re a plant, you have the Incapacitated condition and have Vulnerability to all damage. If you drop to 0 Hit Points, your pot breaks, and your form reverts.` },
    { range: [41, 44], text: `For the next minute, you can teleport up to 20 feet as a Bonus Action on each of your turns.` },
    { range: [45, 48], text: `You and up to three creatures you choose within 30 feet of you have the Invisible condition for 1 minute. This invisibility ends on a creature immediately after it makes an attack roll, deals damage, or casts a spell.` },
    { range: [49, 52], text: `A spectral shield hovers near you for the next minute, granting you a +2 bonus to AC and immunity to Magic Missile.` },
    { range: [53, 56], text: `You can take one extra action on this turn.` },
    { range: [57, 60], text: `You cast a random spell. If the spell normally requires Concentration, it doesn’t require Concentration in this case; the spell lasts for its full duration. Roll 1d10 to determine the spell:
    1: Confusion
    2: Fireball
    3: Fog Cloud
    4: Fly (cast on a random creature within 60 feet of you)
    5: Grease
    6: Levitate (cast on yourself)
    7: Magic Missile (cast as a level 5 spell)
    8: Mirror Image
    9: Polymorph (cast on yourself), and if you fail the saving throw, you turn into a Goat (see appendix B)
    10: See Invisibility` },
    { range: [61, 64], text: `For the next minute, any flammable, nonmagical object you touch that isn’t being worn or carried by another creature bursts into flame, takes 1d4 Fire damage, and is burning.` },
    { range: [65, 68], text: `If you die within the next hour, you immediately revive as if by the Reincarnate spell.` },
    { range: [69, 72], text: `You have the Frightened condition until the end of your next turn. The DM determines the source of your fear.` },
    { range: [73, 76], text: `You teleport up to 60 feet to an unoccupied space you can see.` },
    { range: [77, 80], text: `A random creature within 60 feet of you has the Poisoned condition for 1d4 hours.` },
    { range: [81, 84], text: `You radiate Bright Light in a 30-foot radius for the next minute. Any creature that ends its turn within 5 feet of you has the Blinded condition until the end of its next turn.` },
    { range: [85, 88], text: `Up to three creatures of your choice that you can see within 30 feet of you take 1d10 Necrotic damage. You regain Hit Points equal to the sum of the Necrotic damage dealt.` },
    { range: [89, 92], text: `Up to three creatures of your choice that you can see within 30 feet of you take 4d10 Lightning damage.` },
    { range: [93, 96], text: `You and all creatures within 30 feet of you have Vulnerability to Piercing damage for the next minute.` },
    { range: [97, 100], text: `Roll 1d6:
    1: You regain 2d10 Hit Points.
    2: One ally of your choice within 300 feet of you regains 2d10 Hit Points.
    3: You regain your lowest-level expended spell slot.
    4: One ally of your choice within 300 feet of you regains their lowest-level expended spell slot.
    5: You regain all your expended Sorcery Points.
    6: All the effects of rows 17–20 affect you simultaneously.` }
];

function getSurgeEffect(roll) {
    const effect = wildMagicSurgeEffects.find(e => roll >= e.range[0] && roll <= e.range[1]);
    return effect ? effect.text : "No effect found.";
}

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

function addDice(type) {
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
    rollButton.disabled = !hasDice;
    removeButton.disabled = !hasDice;
}

async function rollDice() {
    let total = 0;
    const diceH1s = diceSection.querySelectorAll('h1[data-die-type]');
    for (let i = 0; i < 70; i++) {
        await new Promise(resolve => setTimeout(resolve, i));
        diceH1s.forEach(h1 => {
            const type = parseInt(h1.dataset.dieType, 10);
            if (diceTypes[type]) {
                const roll = Math.floor(Math.random() * diceTypes[type].max) + 1;
                h1.textContent = roll;
                if (i === 69) {
                    total += roll;
                    totalText.textContent = total;
                    if (type === 100) {
                        const surgeText = getSurgeEffect(roll);
                        wildMagicSurgeText.textContent = surgeText;
                    }
                }
            }
        });
    }
}

function toggle() {
    if(diceOpen === false){
        dicePage.style.display = "block";
        diceOpen = true;
    }
    else if (diceOpen === true){
        dicePage.style.display = "none";
        diceOpen = false;
    }
}

diceToggle.onclick = toggle;

removeButton.onclick = removeDice;
rollButton.onclick = rollDice;

addD20Button.onclick = () => addDice(20);
addD12Button.onclick = () => addDice(12);
addD10Button.onclick = () => addDice(10);
addD8Button.onclick = () => addDice(8);
addD6Button.onclick = () => addDice(6);
addD4Button.onclick = () => addDice(4);
addD100Button.onclick = () => addDice(100);

toggle()
updateButtonState();
