class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.inputHandler = new InputHandler();
        
        this.player = new Player(100, 300);
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        
        this.score = 0;
        this.health = 3;
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.isPaused = false;
        this.isGameOver = false;
        this.isWin = false;
        
        this.coinsCollected = 0;
        this.totalCoins = 0;
        this.maxScore = 100;
        
        this.particles = [];
        
        this.loadLevel(this.currentLevel);
    }
    
    loadLevel(level) {
        // Очищаем предыдущие объекты
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.particles = [];
        
        // Сбрасываем позицию игрока
        this.player.reset(100, 300);
        
        // Загружаем уровень
        switch(level) {
            case 1:
                // Разрушенный город
                this.platforms.push(new Platform(0, 380, 800, 20, '#555555')); // Пол
                this.platforms.push(new Platform(0, 350, 150, 20, '#666666'));
                this.platforms.push(new Platform(250, 300, 120, 20, '#777777'));
                this.platforms.push(new Platform(450, 250, 150, 20, '#888888'));
                this.platforms.push(new Platform(650, 300, 100, 20, '#666666'));
                
                // Разные типы ресурсов
                this.coins.push(new Coin(70, 330, 'battery'));
                this.coins.push(new Coin(300, 280, 'scrap'));
                this.coins.push(new Coin(500, 230, 'fuel'));
                this.coins.push(new Coin(700, 280, 'battery'));
                
                // Враги
                this.enemies.push(new Enemy(200, 330, 'mutant'));
                this.enemies.push(new Enemy(500, 220, 'ghoul'));
                break;
                
            case 2:
                // Заброшенная фабрика
                this.platforms.push(new Platform(0, 380, 800, 20, '#444444'));
                this.platforms.push(new Platform(50, 300, 100, 20, '#555555'));
                this.platforms.push(new Platform(200, 250, 120, 20, '#666666'));
                this.platforms.push(new Platform(400, 200, 150, 20, '#777777'));
                this.platforms.push(new Platform(600, 250, 150, 20, '#666666'));
                this.platforms.push(new Platform(300, 150, 100, 20, '#555555'));
                
                // Больше ресурсов
                for (let i = 0; i < 3; i++) {
                    this.coins.push(new Coin(80 + i * 100, 280, 'battery'));
                    this.coins.push(new Coin(150 + i * 120, 230, 'scrap'));
                }
                this.coins.push(new Coin(650, 200, 'fuel'));
                
                // Более сильные враги
                this.enemies.push(new Enemy(100, 330, 'mutant'));
                this.enemies.push(new Enemy(250, 220, 'robot'));
                this.enemies.push(new Enemy(450, 170, 'mutant'));
                this.enemies.push(new Enemy(650, 220, 'ghoul'));
                break;
                
            case 3:
                // Радиоактивная зона
                this.platforms.push(new Platform(0, 380, 800, 20, '#333333'));
                this.platforms.push(new Platform(30, 300, 80, 20, '#444444'));
                this.platforms.push(new Platform(150, 250, 100, 20, '#555555'));
                this.platforms.push(new Platform(300, 200, 120, 20, '#666666'));
                this.platforms.push(new Platform(500, 250, 100, 20, '#555555'));
                this.platforms.push(new Platform(650, 300, 80, 20, '#444444'));
                this.platforms.push(new Platform(400, 150, 120, 20, '#777777'));
                this.platforms.push(new Platform(200, 100, 80, 20, '#666666'));
                
                // Много ценных ресурсов
                for (let i = 0; i < 5; i++) {
                    this.coins.push(new Coin(50 + i * 150, 280, 'fuel'));
                }
                for (let i = 0; i < 3; i++) {
                    this.coins.push(new Coin(250 + i * 100, 180, 'battery'));
                }
                
                // Элитные враги
                this.enemies.push(new Enemy(50, 330, 'robot'));
                this.enemies.push(new Enemy(180, 220, 'mutant'));
                this.enemies.push(new Enemy(330, 170, 'robot'));
                this.enemies.push(new Enemy(530, 220, 'ghoul'));
                this.enemies.push(new Enemy(430, 120, 'mutant'));
                break;
        }
        
        this.totalCoins = this.coins.length;
        this.coinsCollected = 0;
        this.updateUI();
    }
    
    update() {
        if (this.isPaused || this.isGameOver || this.isWin) return;
        
        // Обновляем игрока
        this.player.update(this.inputHandler);
        
        // Проверка коллизий с платформами
        for (const platform of this.platforms) {
            Collision.resolvePlatformCollision(this.player, platform);
        }
        
        // Проверка падения в пропасть
        if (this.player.y > this.canvas.height) {
            this.health--;
            this.player.reset(100, 300);
            
            if (this.health <= 0) {
                this.gameOver();
            }
        }
        
        // Проверка сбора ресурсов
        for (const coin of this.coins) {
            if (!coin.collected && Collision.checkCoinCollision(this.player, coin)) {
                coin.collect();
                this.score += coin.value;
                this.coinsCollected++;
                
                // Создаем частицы при сборе
                this.createCollectParticles(coin.x, coin.y);
            }
            
            coin.update();
        }
        
        // Обновление врагов
        for (const enemy of this.enemies) {
            enemy.update(this.platforms);
            
            if (Collision.checkEnemyCollision(this.player, enemy)) {
                // Проверка на прыжок на врага
                if (this.player.velocityY > 0 && this.player.y + this.player.height < enemy.y + enemy.height/2) {
                    // Уничтожаем врага
                    this.score += 30;
                    this.createDamageParticles(enemy.x, enemy.y);
                    enemy.x = -100; // Убираем врага
                } else {
                    // Обычное столкновение
                    if (this.player.takeDamage()) {
                        this.health--;
                        this.createDamageParticles(this.player.x, this.player.y);
                        
                        if (this.health <= 0) {
                            this.gameOver();
                        } else {
                            // Отбрасываем игрока
                            this.player.velocityX = (this.player.x < enemy.x ? -10 : 10);
                            this.player.velocityY = -5;
                        }
                    }
                }
            }
        }
        
        // Обновление частиц
        this.particles = this.particles.filter(p => {
            p.update();
            return p.life > 0;
        });
        
        // Проверка победы
        if (this.score >= this.maxScore || this.coinsCollected >= this.totalCoins) {
            if (this.currentLevel < this.maxLevel) {
                this.currentLevel++;
                this.loadLevel(this.currentLevel);
            } else {
                this.win();
            }
        }
        
        this.updateUI();
    }
    
    draw() {
        // Очищаем canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем постапокалиптическое небо
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисуем туман
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.arc(100 + i * 200, 200 + Math.sin(Date.now() * 0.001 + i) * 20, 50, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Рисуем платформы
        for (const platform of this.platforms) {
            platform.draw(this.ctx);
        }
        
        // Рисуем ресурсы
        for (const coin of this.coins) {
            coin.draw(this.ctx);
        }
        
        // Рисуем врагов
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        // Рисуем частицы
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }
        
        // Рисуем игрока
        this.player.draw(this.ctx);
        
        // Рисуем интерфейс поверх игры
        this.drawGameUI();
        
        // Затемнение при паузе
        if (this.isPaused && !this.isGameOver && !this.isWin) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.font = 'bold 48px "Courier New", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ПАУЗА', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '18px "Courier New", monospace';
            this.ctx.fillText('Нажмите P чтобы продолжить', this.canvas.width/2, this.canvas.height/2 + 50);
        }
    }
    
    drawGameUI() {
        // Рисуем индикатор топлива
        const fuelPercent = (this.score / this.maxScore) * 100;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 20);
        this.ctx.fillStyle = fuelPercent > 66 ? '#44ff44' : (fuelPercent > 33 ? '#ffff44' : '#ff4444');
        this.ctx.fillRect(10, 10, (fuelPercent / 100) * 200, 20);
        this.ctx.strokeStyle = '#ff4444';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 200, 20);
        
        // Текст поверх индикатора
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px "Courier New", monospace';
        this.ctx.fillText(`ТОПЛИВО: ${this.score}/${this.maxScore}`, 15, 25);
    }
    
    createCollectParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(x, y, '#ffaa00'));
        }
    }
    
    createDamageParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(x, y, '#ff0000'));
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = this.health;
        document.getElementById('level').textContent = this.currentLevel;
    }
    
    togglePause() {
        if (!this.isGameOver && !this.isWin) {
            this.isPaused = !this.isPaused;
            document.getElementById('pauseButton').textContent = 
                this.isPaused ? '▶️ ПРОДОЛЖИТЬ' : '⏸️ ПАУЗА';
        }
    }
    
    gameOver() {
        this.isGameOver = true;
        this.showOverlay('💀 ВЫЖИВАНИЕ ПРОВАЛЕНО', `Собрано ресурсов: ${this.score}/${this.maxScore}`);
    }
    
    win() {
        this.isWin = true;
        this.showOverlay('🏆 УРОВЕНЬ ПРОЙДЕН', `Вы выжили! Счет: ${this.score}`);
    }
    
    showOverlay(title, message) {
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('gameOverlay').classList.remove('hidden');
    }
    
    restart() {
        this.score = 0;
        this.health = 3;
        this.currentLevel = 1;
        this.isGameOver = false;
        this.isWin = false;
        this.isPaused = false;
        
        document.getElementById('gameOverlay').classList.add('hidden');
        document.getElementById('pauseButton').textContent = '⏸️ ПАУЗА';
        
        this.loadLevel(this.currentLevel);
    }
}

// Класс для частиц
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.life = 1;
        this.color = color;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Гравитация
        this.life -= 0.02;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.restore();
    }
}