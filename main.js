document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Игровой цикл
    function gameLoop() {
        game.update();
        game.draw();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
    
    // Обработчики кнопок
    document.getElementById('pauseButton').addEventListener('click', () => {
        game.togglePause();
    });
    
    document.getElementById('restartButton').addEventListener('click', () => {
        game.restart();
    });
    
    document.getElementById('overlayButton').addEventListener('click', () => {
        game.restart();
    });
    
    // Обработка клавиш для паузы
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p') {
            game.togglePause();
        }
        
        if (e.key.toLowerCase() === 'r' && (game.isGameOver || game.isWin)) {
            game.restart();
        }
    });
    
    // Запуск игры
    game.updateUI();
});