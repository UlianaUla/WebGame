class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderScore(score) {
        this.ctx.font = "24px Arial";
        this.ctx.fillText(`Score: ${score}`, 10, 30);
    }

    renderGameOver() {
        this.ctx.textAlign = "center";
        this.ctx.font = "36px Arial";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);
    }

    renderWin() {
        this.ctx.textAlign = "center";
        this.ctx.font = "36px Arial";
        this.ctx.fillText("YOU WIN!", this.canvas.width / 2, this.canvas.height / 2);
    }
}