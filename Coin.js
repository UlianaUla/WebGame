class Coin {
    constructor(x, y, type = 'battery') {
        this.x = x;
        this.y = y;
        this.width = 15;
        this.height = 15;
        this.type = type;
        this.collected = false;
        this.animationOffset = Math.random() * Math.PI * 2;
        this.value = type === 'battery' ? 10 : (type === 'fuel' ? 20 : 5);
        
        // Разные цвета для разных типов
        if (type === 'battery') {
            this.color = '#ffaa00';
            this.glowColor = '#ff6600';
        } else if (type === 'fuel') {
            this.color = '#ff4444';
            this.glowColor = '#ff0000';
        } else if (type === 'scrap') {
            this.color = '#888888';
            this.glowColor = '#555555';
        }
    }
    
    update() {
        // Анимация парения и вращения
        this.y += Math.sin(Date.now() * 0.005 + this.animationOffset) * 0.3;
        this.rotation = Math.sin(Date.now() * 0.01) * 0.2;
    }
    
    draw(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        
        if (this.type === 'battery') {
            // Батарейка
            ctx.fillStyle = this.color;
            ctx.fillRect(-7, -7, 14, 14);
            
            // Плюс и минус
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-3, -2, 2, 4);
            ctx.fillRect(1, -2, 2, 4);
            
        } else if (this.type === 'fuel') {
            // Канистра
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.rect(-5, -7, 10, 14);
            ctx.fill();
            
            // Горлышко
            ctx.fillRect(-2, -10, 4, 5);
            
        } else {
            // Металлолом
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-7, -7);
            ctx.lineTo(7, -3);
            ctx.lineTo(3, 7);
            ctx.lineTo(-7, 3);
            ctx.closePath();
            ctx.fill();
        }
        
        // Свечение
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 15;
        ctx.fill();
        
        ctx.restore();
    }
    
    collect() {
        this.collected = true;
    }
}