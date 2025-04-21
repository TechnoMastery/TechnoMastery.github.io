document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const choices = document.querySelectorAll('.choice');
    const playerScore = document.getElementById('player-score');
    const computerScore = document.getElementById('computer-score');
    const resultDisplay = document.getElementById('result');
    const historyList = document.getElementById('history-list');
    const resetButton = document.getElementById('reset');

    // Initialisation des scores
    let score = {
        player: 0,
        computer: 0
    };

    // Ajout des événements aux boutons de choix
    choices.forEach(choice => {
        choice.addEventListener('click', function() {
            const playerChoice = this.id;
            playRound(playerChoice);
        });
    });

    // Bouton de réinitialisation du jeu
    resetButton.addEventListener('click', resetGame);

    // Fonction pour jouer un tour
    function playRound(playerChoice) {
        const options = ['rock', 'paper', 'scissors'];
        const computerChoice = options[Math.floor(Math.random() * options.length)];

        const result = getResult(playerChoice, computerChoice);
        updateUI(playerChoice, computerChoice, result);
    }

    // Fonction pour déterminer le gagnant
    function getResult(player, computer) {
        if (player === computer) return 'égalité';

        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        if (winConditions[player] === computer) {
            score.player++;
            return 'gagné';
        } else {
            score.computer++;
            return 'perdu';
        }
    }

    // Mise à jour de l'interface utilisateur
    function updateUI(playerChoice, computerChoice, result) {
        const emojiMap = {
            rock: '🪨',
            paper: '🍂',
            scissors: '✂️'
        };

        const frenchMap = {
            rock: 'Pierre',
            paper: 'Feuille',
            scissors: 'Ciseaux'
        };

        // Message de résultat
        let message = '';
        if (result === 'gagné') {
            message = `Vous avez gagné ! ${frenchMap[playerChoice]} bat ${frenchMap[computerChoice]}`;
        } else if (result === 'perdu') {
            message = `Vous avez perdu ! ${frenchMap[computerChoice]} bat ${frenchMap[playerChoice]}`;
        } else {
            message = `Égalité ! Vous avez tous les deux choisi ${frenchMap[playerChoice]}`;
        }

        resultDisplay.textContent = message;

        // Mise à jour des scores
        playerScore.textContent = score.player;
        computerScore.textContent = score.computer;

        // Mise à jour de l'historique
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <span>Vous: ${emojiMap[playerChoice]}</span> vs 
            <span>Ordinateur: ${emojiMap[computerChoice]}</span> - 
            <strong>${result.charAt(0).toUpperCase() + result.slice(1)}</strong>
        `;
        historyList.prepend(historyItem);

        // Limiter l'historique à 10 éléments maximum
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    // Fonction pour réinitialiser le jeu
    function resetGame() {
        score.player = 0;
        score.computer = 0;
        playerScore.textContent = '0';
        computerScore.textContent = '0';
        resultDisplay.textContent = 'Faites votre choix !';
        historyList.innerHTML = '';
    }
});