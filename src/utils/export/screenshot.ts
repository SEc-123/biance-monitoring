import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Timeframe } from '../../types/binance';

const captureElement = async (element: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
};

export const captureTimeframes = async (
  symbol: string,
  timeframes: Timeframe[]
): Promise<void> => {
  const element = document.querySelector('.indicators-container');
  if (!element) {
    throw new Error('Indicators container not found');
  }

  if (timeframes.length === 1) {
    // Single timeframe - save directly
    const blob = await captureElement(element as HTMLElement);
    saveAs(blob, `${symbol}_${timeframes[0]}_indicators.png`);
  } else {
    // Multiple timeframes - create ZIP
    const zip = new JSZip();
    const captures = await Promise.all(
      timeframes.map(async (tf) => ({
        timeframe: tf,
        blob: await captureElement(element as HTMLElement)
      }))
    );

    captures.forEach(({ timeframe, blob }) => {
      zip.file(`${symbol}_${timeframe}_indicators.png`, blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${symbol}_indicators.zip`);
  }
};