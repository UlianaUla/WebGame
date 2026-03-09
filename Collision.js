class Collision {
    static checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static resolvePlatformCollision(player, platform) {
        if (!this.checkRectCollision(player, platform)) {
            return false;
        }
        
        // Вычисляем перекрытие по каждой оси
        const playerRight = player.x + player.width;
        const playerBottom = player.y + player.height;
        const platformRight = platform.x + platform.width;
        const platformBottom = platform.y + platform.height;
        
        const overlapLeft = playerRight - platform.x;
        const overlapRight = platformRight - player.x;
        const overlapTop = playerBottom - platform.y;
        const overlapBottom = platformBottom - player.y;
        
        // Находим минимальное перекрытие
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        // Определяем сторону столкновения и корректируем позицию
        if (minOverlap === overlapTop) {
            // Столкновение сверху
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isGrounded = true;
        } else if (minOverlap === overlapBottom) {
            // Столкновение снизу
            player.y = platform.y + platform.height;
            player.velocityY = 0;
        } else if (minOverlap === overlapLeft) {
            // Столкновение справа от игрока
            player.x = platform.x - player.width;
            player.velocityX = 0;
        } else if (minOverlap === overlapRight) {
            // Столкновение слева от игрока
            player.x = platform.x + platform.width;
            player.velocityX = 0;
        }
        
        return true;
    }
    
    static checkCoinCollision(player, coin) {
        return this.checkRectCollision(player, coin);
    }
    
    static checkEnemyCollision(player, enemy) {
        return this.checkRectCollision(player, enemy);
    }
}