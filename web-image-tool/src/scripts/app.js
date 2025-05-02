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
        const backgroundColor = '#efefef'; // Updated to light grey (#efefef)
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
        const backgroundColor = '#efefef'; // Light grey background
        const shadowColor = 'rgba(0, 0, 0, 0.5)'; // Drop shadow color

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set shadow properties
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0; // Shadow centered horizontally
        ctx.shadowOffsetY = 0; // Shadow centered vertically

        // Calculate the position and size to center the image while maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const imageAspectRatio = img.width / img.height;

        let newWidth, newHeight;

        if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than the canvas
            newWidth = canvas.width * 0.8; // Use 80% of the canvas width
            newHeight = newWidth / imageAspectRatio;
        } else {
            // Image is taller than the canvas
            newHeight = canvas.height * 0.8; // Use 80% of the canvas height
            newWidth = newHeight * imageAspectRatio;
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