// QR code detection using jsqrcode library
const detectQRCode = (imageData) => {
  return new Promise((resolve) => {
    try {
      // Create a grayscale image array
      const grayscaleData = new Uint8Array(imageData.width * imageData.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Convert RGB to grayscale using luminosity method
        const gray = 0.299 * imageData.data[i] + 
                    0.587 * imageData.data[i + 1] + 
                    0.114 * imageData.data[i + 2];
        grayscaleData[i / 4] = gray;
      }

      // Set up QR code detector
      window.qrcode.callback = (result) => {
        if (result === 'error decoding QR Code') {
          resolve(null);
        } else {
          resolve(result);
        }
      };

      // Create a temporary canvas to hold the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      
      // Put the image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to data URL and decode
      window.qrcode.decode(canvas.toDataURL());
    } catch (error) {
      console.error('QR detection error:', error);
      resolve(null);
    }
  });
};

export { detectQRCode };
