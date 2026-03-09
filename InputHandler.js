class InputHandler {
    constructor() {
        this.keys = new Set();
        
        window.addEventListener('keydown', (e) => {
            // Предотвращаем прокрутку страницы при нажатии стрелок и пробела
            if (this.isMovementKey(e.key)) {
                e.preventDefault();
            }
            
            // Добавляем клавишу в Set (используем код клавиши для избежания дубликатов)
            const key = e.key.toLowerCase();
            if (this.isValidKey(key)) {
                this.keys.add(key);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.isValidKey(key)) {
                this.keys.delete(key);
            }
        });
        
        // Предотвращаем прокрутку при зажатых клавишах
        window.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key.startsWith('Arrow')) {
                e.preventDefault();
            }
        }, false);
    }
    
    isMovementKey(key) {
        const movementKeys = [' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];
        return movementKeys.includes(key.toLowerCase());
    }
    
    isValidKey(key) {
        const validKeys = ['a', 'd', 'w', 's', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '];
        return validKeys.includes(key);
    }
    
    isPressed(key) {
        return this.keys.has(key.toLowerCase());
    }
}