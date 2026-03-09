class Enemy {
    constructor(x, y, type = 'mutant') {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.speed = type === 'mutant' ? 1.5 : 3;
        this.direction = 1;
        this.startX = x;
        this.range = 150;
        this.animationFrame = 0;
        
        // Разные типы врагов
        if (type === 'mutant') {
            this.color = '#44aa44';
            this.health = 2;
        } else if (type === 'robot') {
            this.color = '#888888';
            this.health = 3;
            this.speed = 2.5;
        } else if (type === 'ghoul') {
            this.color = '#666666';
            this.health = 1;
            this.speed = 4;
        }
    }
    
    update(platforms) {
        this.animationFrame += 0.1;
        
        // Движение врага
        this.x += this.speed * this.direction;
        
        // Проверка на краю платформы
        let onPlatform = false;
        let edgeDetected = true;
        
        for (const platform of platforms) {
            // Проверяем, стоит ли враг на платформе
            if (this.x + this.width > platform.x && 
                this.x < platform.x + platform.width &&
                Math.abs(this.y + this.height - platform.y) < 10) {
                onPlatform = true;
                
                // Проверяем, есть ли платформа в направлении движения
                const nextX = this.x + this.speed * this.direction * 2;
                if (nextX + this.width > platform.x && 
                    nextX < platform.x + platform.width) {
                    edgeDetected = false;
                }
            }
        }
        
        // Разворот на краю или по достижении границ
        if (edgeDetected || this.x <= this.startX - this.range || 
            this.x + this.width >= this.startX + this.range) {
            this.direction *= -1;
        }
        
        // Анимация мутанта - небольшое подпрыгивание
        if (this.type === 'mutant') {
            this.y += Math.sin(this.animationFrame) * 0.5;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        if (this.type === 'mutant') {
            // Мутант
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Глаза
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y + 10, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 22, this.y + 10, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Щупальца
            ctx.strokeStyle = '#44aa44';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 5, this.y + 25);
            ctx.lineTo(this.x - 5, this.y + 35);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x + 25, this.y + 25);
            ctx.lineTo(this.x + 35, this.y + 35);
            ctx.stroke();
            
        } else if (this.type === 'robot') {
            // Робот
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Глаз-лазер
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + 10, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Антенна
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y - 5);
            ctx.lineTo(this.x + 15, this.y);
            ctx.stroke();
            
        } else if (this.type === 'ghoul') {
            // Призрак
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Глаза
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y + 10, 3, 0, Math.PI * 2);
            ctx.arc(this.x + 22, this.y + 10, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}