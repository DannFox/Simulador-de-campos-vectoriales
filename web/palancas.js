const canvas = document.getElementById('simulador');
        const ctx = canvas.getContext('2d');

        // Definir los cuadrados
        const squares = [
            { x: 50, y: 300, width: 30, height: 30, weight: 1, velocity_y: 0 },   // Cuadrado 1
            { x: 150, y: 300, width: 30, height: 30, weight: 1, velocity_y: 0 },  // Cuadrado 2
            { x: 250, y: 300, width: 30, height: 30, weight: 1, velocity_y: 0 }   // Cuadrado 3
        ];

        // Variables para el arrastre
        let dragging = false;
        let draggedSquare = null;
        let offsetX = 0;
        let offsetY = 0;

        // Variables para la línea de la palanca
        const pivot_x = 200;  // Posición en x del pivote
        const pivot_y = 225;  // Posición en y del pivote
        const line_length = 240;  // Longitud de la línea

        // Gravedad
        const gravity = 0.5;

        // Dibujar el triángulo
        function drawTriangle() {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.moveTo(175, 275); // Punto izquierdo
            ctx.lineTo(225, 275); // Punto derecho
            ctx.lineTo(200, 225); // Punto superior
            ctx.closePath();
            ctx.fill();
        }

        // Dibujar los cuadrados
        function drawSquares() {
            ctx.fillStyle = 'green';
            squares.forEach(square => {
                ctx.fillRect(square.x, square.y, square.width, square.height);
            });
        }

        // Dibujar la línea de la palanca
        function drawLine() {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(pivot_x - line_length / 2, pivot_y);
            ctx.lineTo(pivot_x + line_length / 2, pivot_y);
            ctx.stroke();
        }

        // Actualizar la posición de los cuadrados
        function updateSquares() {
            squares.forEach(square => {
                if (!dragging || square !== draggedSquare) {
                    // Incrementar la velocidad debido a la gravedad
                    square.velocity_y += gravity;

                    // Actualizar la posición del cuadrado
                    square.y += square.velocity_y;

                    // Comprobar si el cuadrado toca el "suelo"
                    if (square.y + square.height >= canvas.height - 30) {
                        square.y = canvas.height - 30 - square.height;
                        square.velocity_y = 0;  // Reiniciar la velocidad al tocar el suelo
                    }

                    // Comprobar si los cuadrados están sobre la línea
                    if (square.y + square.height >= pivot_y && 
                        pivot_x - line_length / 2 <= square.x + square.width / 2 && 
                        square.x + square.width / 2 <= pivot_x + line_length / 2) {
                        // Colocar el cuadrado en la posición de la línea
                        square.y = pivot_y - square.height;
                    }
                }
            });
        }

        // Función principal de dibujo
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
            updateSquares(); // Actualizar la posición de los cuadrados
            drawLine(); // Dibujar la línea de la palanca
            drawSquares(); // Dibujar los cuadrados
            drawTriangle(); // Dibujar el triángulo
        }

        // Manejar eventos de mouse
        canvas.addEventListener('mousedown', (event) => {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            for (const square of squares) {
                if (mouseX > square.x && mouseX < square.x + square.width &&
                    mouseY > square.y && mouseY < square.y + square.height) {
                    dragging = true;
                    draggedSquare = square;
                    offsetX = square.x - mouseX;
                    offsetY = square.y - mouseY;
                    square.velocity_y = 0; // Detener la caída del cuadrado arrastrado
                    break;
                }
            }
        });

        canvas.addEventListener('mouseup', () => {
            dragging = false;
            draggedSquare = null;
        });

        canvas.addEventListener('mousemove', (event) => {
            if (dragging && draggedSquare) {
                const newX = event.offsetX + offsetX;
                const newY = event.offsetY + offsetY;

                // Verificar colisiones con los bordes de la ventana
                if (newX < 0) {
                    draggedSquare.x = 0;
                } else if (newX + draggedSquare.width > canvas.width) {
                    draggedSquare.x = canvas.width - draggedSquare.width;
                } else {
                    draggedSquare.x = newX;
                }

                if (newY < 0) {
                    draggedSquare.y = 0;
                } else if (newY + draggedSquare.height > canvas.height) {
                    draggedSquare.y = canvas.height - draggedSquare.height;
                } else {
                    draggedSquare.y = newY;
                }
            }
        });

        // Iniciar el bucle de dibujo
        setInterval(draw, 1000 / 60); // Aproximadamente 60 FPS