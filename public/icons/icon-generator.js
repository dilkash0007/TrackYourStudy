// This script creates placeholder icons for PWA
// Run with Node.js: node icon-generator.js

const fs = require('fs');
const { createCanvas } = require('canvas');

// Icon sizes defined in manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate an icon of the specified size
function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#4f46e5');
  gradient.addColorStop(1, '#818cf8');
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Draw a border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = Math.max(1, size / 48);
  ctx.strokeRect(size * 0.1, size * 0.1, size * 0.8, size * 0.8);
  
  // Add text
  const fontSize = Math.max(10, size / 5);
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  
  // Draw "TYS" text (TrackYouStudy initials)
  ctx.fillText('TYS', size / 2, size / 2);
  
  return canvas.toBuffer('image/png');
}

// Create a social preview image (larger with more details)
function generateSocialPreview() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#4f46e5');
  gradient.addColorStop(1, '#818cf8');
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add app name
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.fillText('TrackYouStudy', width / 2, height / 2 - 40);
  
  // Add tagline
  ctx.font = '36px Arial';
  ctx.fillText('Track Your Study Habits', width / 2, height / 2 + 40);
  
  return canvas.toBuffer('image/png');
}

// Ensure the icons directory exists
if (!fs.existsSync('./')) {
  console.log('Creating icons directory...');
  fs.mkdirSync('./', { recursive: true });
}

// Generate icons of all sizes
console.log('Generating PWA icons...');
sizes.forEach(size => {
  const iconData = generateIcon(size);
  fs.writeFileSync(`./icon-${size}x${size}.png`, iconData);
  console.log(`Created icon-${size}x${size}.png`);
});

// Generate social preview
console.log('Generating social preview image...');
const previewData = generateSocialPreview();
fs.writeFileSync('./social-preview.png', previewData);
console.log('Created social-preview.png');

console.log('Icon generation complete!'); 