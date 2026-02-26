#!/usr/bin/env node

/**
 * Deployment script for Eventum Orthopaedics Chatbot
 * 
 * This script:
 * 1. Builds both the app and library bundles
 * 2. Uploads files to S3 bucket (eventumortho.click)
 * 3. Invalidates CloudFront cache for updated files
 * 
 * Usage: npm run deploy
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const S3_BUCKET = 'eventumortho.click';
const CLOUDFRONT_DISTRIBUTION_ID = 'E2Q3EB0DPEY10J'; // From AWS CLI query

// Files that need cache invalidation when updated
const FILES_TO_INVALIDATE = [
  '/evi-chatbot.js',
  '/evi-chatbot-loader.js',
  '/index.html',
  '/evielogo.svg',
  '/eviemonologo.svg',
];

function log(message) {
  console.log(`[DEPLOY] ${message}`);
}

function runCommand(command, description) {
  log(description);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    return true;
  } catch (error) {
    console.error(`Error: ${description} failed`);
    return false;
  }
}

function uploadToS3(source, destination, contentType = null, cacheControl = null) {
  let command = `aws s3 cp "${source}" "s3://${S3_BUCKET}/${destination}"`;
  
  if (cacheControl) {
    command += ` --cache-control "${cacheControl}"`;
  }
  
  if (contentType) {
    command += ` --content-type "${contentType}"`;
  }
  
  return runCommand(command, `Uploading ${destination}`);
}

function syncDirectory(source, destination, exclude = []) {
  let command = `aws s3 sync "${source}" "s3://${S3_BUCKET}/${destination}"`;
  
  if (exclude.length > 0) {
    exclude.forEach(pattern => {
      command += ` --exclude "${pattern}"`;
    });
  }
  
  return runCommand(command, `Syncing ${destination}`);
}

function invalidateCloudFront(paths) {
  log(`Invalidating CloudFront cache for ${paths.length} path(s)...`);
  
  const pathsJson = JSON.stringify(paths);
  const command = `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths ${paths.map(p => `"${p}"`).join(' ')}`;
  
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    log('CloudFront invalidation created successfully');
    log('Note: Cache invalidation can take 1-5 minutes to complete');
    return true;
  } catch (error) {
    console.error('Error: CloudFront invalidation failed');
    return false;
  }
}

async function main() {
  log('Starting deployment...');
  log(`S3 Bucket: ${S3_BUCKET}`);
  log(`CloudFront Distribution: ${CLOUDFRONT_DISTRIBUTION_ID}`);
  log('');

  // Step 1: Build
  log('Step 1: Building application and library...');
  if (!runCommand('npm run build:all', 'Building all bundles')) {
    process.exit(1);
  }
  log('');

  // Step 2: Upload critical files with proper cache headers
  log('Step 2: Uploading files to S3...');
  
  // Chatbot library bundle (immutable, long cache)
  uploadToS3(
    'dist/evi-chatbot.js',
    'evi-chatbot.js',
    'application/javascript',
    'public, max-age=31536000, immutable'
  );
  
  // Loader script (immutable, long cache)
  uploadToS3(
    'public/evi-chatbot-loader.js',
    'evi-chatbot-loader.js',
    'application/javascript',
    'public, max-age=31536000, immutable'
  );
  
  // Index HTML (shorter cache for HTML)
  uploadToS3(
    'dist/index.html',
    'index.html',
    'text/html',
    'public, max-age=3600'
  );
  
  // Logo assets (immutable, long cache)
  uploadToS3(
    'dist/evielogo.svg',
    'evielogo.svg',
    'image/svg+xml',
    'public, max-age=31536000, immutable'
  );
  
  uploadToS3(
    'dist/eviemonologo.svg',
    'eviemonologo.svg',
    'image/svg+xml',
    'public, max-age=31536000, immutable'
  );
  
  // Sync assets directory
  syncDirectory('dist/assets', 'assets', ['*.html']);
  
  log('');

  // Step 3: Invalidate CloudFront cache
  log('Step 3: Invalidating CloudFront cache...');
  if (!invalidateCloudFront(FILES_TO_INVALIDATE)) {
    log('Warning: CloudFront invalidation failed, but files are uploaded to S3');
    log('You may need to manually invalidate the cache in AWS Console');
  }
  log('');

  log('✅ Deployment complete!');
  log('');
  log('Next steps:');
  log('1. Wait 1-5 minutes for CloudFront cache invalidation to complete');
  log('2. Test the chatbot on your WordPress site');
  log('3. If issues persist, check CloudFront invalidation status in AWS Console');
  log('');
  log(`CloudFront Distribution: https://console.aws.amazon.com/cloudfront/v3/home#/distributions/${CLOUDFRONT_DISTRIBUTION_ID}`);
}

main().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});

