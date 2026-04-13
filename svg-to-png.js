#!/usr/bin/env node
import puppeteer from 'puppeteer';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [, , svgName, pngName, widthStr, heightStr] = process.argv;

if (!svgName || !pngName) {
  console.error('Usage: node svg-to-png.js <svg> <png> [width] [height]');
  process.exit(1);
}

const svgContents = await readFile(svgName, 'utf-8');

// Launch puppeteer and draw all SVGs onto a single canvas
const browser = await puppeteer.launch();
const page = await browser.newPage();

const pngDataUrl = await page.evaluate(
  async (svgContents, widthStr, heightStr) => {

    const blob = new Blob([svgContents], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    await img.decode();

    const aspect = img.naturalHeight / img.naturalWidth;
    const width = widthStr ? parseInt(widthStr, 10) : img.naturalWidth;
    const aspectHeight = Math.ceil(width * aspect);
    const height = heightStr ? parseInt(heightStr, 10) : aspectHeight;

    if (isNaN(width) || width <= 0) {
      console.error('width must be a positive integer');
      process.exit(1);
    }

    if (isNaN(height) || width <= 0) {
      console.error('height must be a positive integer');
      process.exit(1);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const y = (height - aspectHeight) / 2;

    ctx.drawImage(img, 0, y, width, aspectHeight);
    URL.revokeObjectURL(url);

    return canvas.toDataURL('image/png');
  },
  svgContents,
  widthStr,
  heightStr,
);

await browser.close();

// Strip the data URL prefix and decode to a Buffer
const pngBuffer = Buffer.from(pngDataUrl.slice('data:image/png;base64,'.length), 'base64');
writeFile(pngName, pngBuffer),

console.log(`Wrote ${pngName}`);
