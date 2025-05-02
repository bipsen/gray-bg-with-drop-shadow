document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('uploadInput');
    const downloadButton = document.getElementById('downloadButton');

    canvas.width = 1000;
    canvas.height = 720;

    // Initialize the canvas with a grey background
    initializeCanvas();

    uploadInput.addEventListener('change', handleImageUpload);
    downloadButton.addEventListener('click', downloadImage);

    function initializeCanvas() {
        const backgroundColor = '#d3d3d3'; // Light grey background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    drawImageOnCanvas(img);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function drawImageOnCanvas(img) {
        const backgroundColor = '#d3d3d3'; // Light grey background
        const shadowColor = 'rgba(0, 0, 0, 0.5)'; // Drop shadow color

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set shadow properties
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 10;
        ctx.shadowOffsetY = 10;

        // Calculate the position to center the image
        const aspectRatio = img.width / img.height;
        let newWidth, newHeight;

        if (aspectRatio > 1) {
            newWidth = 1000;
            newHeight = 1000 / aspectRatio;
        } else {
            newHeight = 720;
            newWidth = 720 * aspectRatio;
        }

        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        // Draw the image
        ctx.drawImage(img, x, y, newWidth, newHeight);
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});