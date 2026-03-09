class Platform {
    constructor(x, y, width, height, color = '#8B4513') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Добавляем текстуру травы сверху
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x, this.y, this.width, 5);
        
        // Рисуем тень
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 3);
    }
}