const rollOutput = document.getElementById('rollOutput');
const rollButton = document.getElementById('rollButton');
const min = 1;
const max = 20;
let randomNumber;

rollButton.onclick = function(){
    randomNumber = Math.floor(Math.random() * max) + min;
    rollOutput.textContent = randomNumber;
}