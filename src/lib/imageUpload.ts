/**
 * Compresses a user-selected image file into a compact JPEG Data URL
 * suitable for direct storage in Firestore documents (< 200KB).
 */
export function compressImageToDataUrl(
  file: File,
  maxDimension = 900,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select a valid image file."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas rendering context unavailable."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length > 260000) {
          dataUrl = canvas.toDataURL("image/jpeg", 0.65);
        }
        if (dataUrl.length > 320000) {
          reject(new Error("Image is too large even after compression. Please use a smaller image or URL."));
          return;
        }
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
