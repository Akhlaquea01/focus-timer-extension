document.addEventListener('DOMContentLoaded', () => {
    // Get the game items by their IDs
    const catchGameBtn = document.getElementById('catch-game');
    // const game2Btn = document.getElementById('game2');

    // Event listener for Catch the Falling Object game
    catchGameBtn.addEventListener('click', () => openGame('Catch-the-Falling-Object/game.html'));

    // Event listener for Game 2
    // game2Btn.addEventListener('click', () => openGame('game2.html'));

    // Function to navigate to the selected game page
    function openGame(gameName) {
        window.location.href = window.location.origin + `/mini-game/${gameName}`;
    }
});
