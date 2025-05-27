document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('uploadInput');
    const downloadButton = document.getElementById('downloadButton');

    uploadInput.addEventListener('change', handleImageUpload);
    downloadButton.addEventListener('click', downloadImage);

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const fileType = file.type;

            if (fileType === 'application/pdf') {
                // Handle PDF file
                const reader = new FileReader();
                reader.onload = function (e) {
                    const pdfData = new Uint8Array(e.target.result);
                    renderPDF(pdfData);
                };
                reader.readAsArrayBuffer(file);
            } else if (fileType === 'image/png' || fileType === 'image/jpeg') {
                // Handle image file
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        adjustCanvasSize(img);
                        drawImageOnCanvas(img);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                alert('Unsupported file type. Please upload a PNG, JPEG, or PDF.');
            }
        }
    }

    function adjustCanvasSize() {
        canvas.width = 1900;
        canvas.height = 1400;
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
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Calculate the position and size to center the image while maintaining aspect ratio
        const canvasAspectRatio = canvas.width / canvas.height;
        const imageAspectRatio = img.width / img.height;

        let newWidth, newHeight;

        if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas
            newWidth = canvas.width * 0.85; // Use 85% of the canvas width
            newHeight = newWidth / imageAspectRatio;
        } else {
            // Image is taller than canvas
            newHeight = canvas.height * 0.85; // Use 85% of the canvas height
            newWidth = newHeight * imageAspectRatio;
        }

        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        // Draw the image
        ctx.drawImage(img, x, y, newWidth, newHeight);
    }

    function renderPDF(pdfData) {
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        loadingTask.promise.then(function (pdf) {
            // Get the first page
            pdf.getPage(1).then(function (page) {
                const viewport = page.getViewport({ scale: 2 }); // Increase scale for higher resolution
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');

                tempCanvas.width = viewport.width;
                tempCanvas.height = viewport.height;

                const renderContext = {
                    canvasContext: tempCtx,
                    viewport: viewport,
                };

                page.render(renderContext).promise.then(function () {
                    const img = new Image();
                    img.onload = function () {
                        adjustCanvasSize();
                        drawImageOnCanvas(img);
                    };
                    img.src = tempCanvas.toDataURL('image/png');
                });
            });
        }).catch(function (error) {
            console.error('Error loading PDF:', error);
            alert('Failed to load PDF. Please try again.');
        });
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download =  `${'processed' + Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }  
});