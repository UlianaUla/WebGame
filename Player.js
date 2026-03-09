class Player {
    constructor(x, y, width = 25, height = 35) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpForce = -12;
        this.gravity = 0.8;
        this.isGrounded = false;
        this.facing = 1; // 1 = вправо, -1 = влево
        this.animationFrame = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
    }
    
    update(inputHandler) {
        // Горизонтальное движение
        let moving = false;
        if (inputHandler.isPressed('a') || inputHandler.isPressed('arrowleft')) {
            this.velocityX = -this.speed;
            this.facing = -1;
            moving = true;
        } else if (inputHandler.isPressed('d') || inputHandler.isPressed('arrowright')) {
            this.velocityX = this.speed;
            this.facing = 1;
            moving = true;
        } else {
            this.velocityX *= 0.7; // Трение
        }
        
        // Анимация движения
        if (moving && this.isGrounded) {
            this.animationFrame += 0.2;
        } else {
            this.animationFrame = 0;
        }
        
        // Прыжок
        if ((inputHandler.isPressed('w') || inputHandler.isPressed('arrowup') || 
             inputHandler.isPressed(' ')) && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }
        
        // Применяем гравитацию
        this.velocityY += this.gravity;
        
        // Обновляем позицию
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Границы экрана
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > 800) {
            this.x = 800 - this.width;
        }
        
        // Временно сбрасываем grounded, будет установлено при коллизии
        this.isGrounded = false;
        
        // Обновление неуязвимости
        if (this.isInvulnerable) {
            this.invulnerableTimer--;
            if (this.invulnerableTimer <= 0) {
                this.isInvulnerable = false;
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Мигание при неуязвимости
        if (this.isInvulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // Рисуем тело (постапокалиптический сталкер)
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Рисуем противогаз
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 10);
        
        // Стекло противогаза
        ctx.fillStyle = '#66ccff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(this.x + 8, this.y + 7, 4, 4);
        ctx.fillRect(this.x + this.width - 12, this.y + 7, 4, 4);
        
        ctx.globalAlpha = 1;
        
        // Рюкзак
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(this.x + this.width - 5, this.y + 10, 5, 15);
        
        // Анимация движения (ноги)
        if (!this.isGrounded) {
            // В прыжке
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(this.x + 5, this.y + this.height, 5, 5);
            ctx.fillRect(this.x + this.width - 10, this.y + this.height, 5, 5);
        } else {
            // При ходьбе
            const legOffset = Math.sin(this.animationFrame) * 3;
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(this.x + 5, this.y + this.height + legOffset, 5, 8);
            ctx.fillRect(this.x + this.width - 10, this.y + this.height - legOffset, 5, 8);
        }
        
        ctx.restore();
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isGrounded = false;
    }
    
    takeDamage() {
        if (!this.isInvulnerable) {
            this.isInvulnerable = true;
            this.invulnerableTimer = 60; // ~1 секунда при 60fps
            return true;
        }
        return false;
    }
}