import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Point worker directly to local Vite-bundled worker asset
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

export interface ExtractedPdf {
  text: string;
  pageCount: number;
  hasText: boolean;
  images?: string[]; // Base64 images if scanned / fallback
}

/**
 * Extracts text and metadata from a PDF File or ArrayBuffer.
 * If the PDF has no selectable text (scanned document), it renders the first few pages to canvas as images.
 */
export async function extractTextFromPdf(file: File): Promise<ExtractedPdf> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  let fullText = "";

  for (let pageNum = 1; pageNum <= Math.min(pageCount, 50); pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .filter((s: string) => s.trim().length > 0);

      const pageText = pageStrings.join(" ");
      if (pageText.trim()) {
        fullText += `\n\n--- Page ${pageNum} ---\n${pageText.trim()}`;
      }
    } catch (e) {
      console.warn(`Failed to extract text from page ${pageNum}:`, e);
    }
  }

  const hasText = fullText.trim().length > 30;

  // If the PDF has virtually no extractable text, render the first 1-3 pages to image data URLs
  // so multimodal vision models can read scanned documents directly!
  const renderedImages: string[] = [];
  if (!hasText && typeof document !== "undefined") {
    const pagesToRender = Math.min(pageCount, 3);
    for (let pageNum = 1; pageNum <= pagesToRender; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          renderedImages.push(canvas.toDataURL("image/jpeg", 0.85));
        }
      } catch (err) {
        console.warn(`Failed to render scanned PDF page ${pageNum} to canvas:`, err);
      }
    }
  }

  return {
    text: fullText.trim(),
    pageCount,
    hasText,
    images: renderedImages.length > 0 ? renderedImages : undefined,
  };
}
