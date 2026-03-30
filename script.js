document.addEventListener('DOMContentLoaded', () => {
    loadSavedPoints();

    document.getElementById('btnSwap').addEventListener('click', swapTeams);
    document.getElementById('btnCalc').addEventListener('click', calculate);
});

function loadSavedPoints() {
    const savedA = localStorage.getItem('fifaPoint_TeamA');
    const savedB = localStorage.getItem('fifaPoint_TeamB');
    
    if (savedA !== null) document.getElementById('teamA').value = savedA;
    if (savedB !== null) document.getElementById('teamB').value = savedB;
}

function saveToStorage(pA, pB) {
    localStorage.setItem('fifaPoint_TeamA', pA);
    localStorage.setItem('fifaPoint_TeamB', pB);
    
    const msgElement = document.getElementById('storageMsg');
    msgElement.textContent = "Points saved to local storage.";
    setTimeout(() => { msgElement.textContent = ""; }, 3000);
}

function swapTeams() {
    const teamAInput = document.getElementById('teamA');
    const teamBInput = document.getElementById('teamB');
    
    const temp = teamAInput.value;
    teamAInput.value = teamBInput.value;
    teamBInput.value = temp;

    saveToStorage(teamAInput.value, teamBInput.value);

    if (document.getElementById('resultsBlock').style.display === 'block') {
        calculate();
    }
}

function calculate() {
    const pA = parseFloat(document.getElementById('teamA').value);
    const pB = parseFloat(document.getElementById('teamB').value);
    const I = parseFloat(document.getElementById('importance').value);
    const resultType = document.getElementById('result').value;
    const isKnockout = document.getElementById('isKnockout').checked;

    if (isNaN(pA) || isNaN(pB)) {
        alert("Please enter valid points for both teams.");
        return;
    }

    saveToStorage(pA, pB);

    let Wa, Wb;
    switch(resultType) {
        case 'win':      Wa = 1;    Wb = 0;    break;
        case 'win_pen':  Wa = 0.75; Wb = 0.5;  break;
        case 'draw':     Wa = 0.5;  Wb = 0.5;  break;
        case 'loss_pen': Wa = 0.5;  Wb = 0.75; break;
        case 'loss':     Wa = 0;    Wb = 1;    break;
    }

    const drA = pA - pB;
    const WeA = 1 / (Math.pow(10, -drA / 600) + 1);
    
    const drB = pB - pA;
    const WeB = 1 / (Math.pow(10, -drB / 600) + 1);

    let changeA = I * (Wa - WeA);
    let changeB = I * (Wb - WeB);

    if (isKnockout) {
        if (changeA < 0) changeA = 0;
        if (changeB < 0) changeB = 0;
    }

    const totalA = pA + changeA;
    const totalB = pB + changeB;

    updateUI('A', changeA, totalA);
    updateUI('B', changeB, totalB);

    document.getElementById('resultsBlock').style.display = 'block';
}

function updateUI(teamStr, change, total) {
    const changeEl = document.getElementById(`change${teamStr}`);
    const totalEl = document.getElementById(`total${teamStr}`);

    const formattedChange = (change > 0 ? '+' : '') + change.toFixed(2);
    changeEl.textContent = formattedChange;
    totalEl.textContent = total.toFixed(2);

    changeEl.className = '';
    if (change > 0) changeEl.classList.add('positive');
    else if (change < 0) changeEl.classList.add('negative');
    else changeEl.classList.add('neutral');
}
