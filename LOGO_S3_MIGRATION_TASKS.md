# Logo S3 Migration Task List

## Problem Statement

When the chatbot is embedded into external websites (e.g., WordPress), the browser tries to load logo SVGs from relative paths:
- `/evielogo.svg`
- `/eviemonologo.svg`

This causes 404 errors because these files don't exist on the host site's origin.

## Goal

Move logo assets to S3 and update all code to use absolute URLs from `https://eventumortho.click/` so the chatbot works correctly when embedded anywhere.

---

## STEP 1: Locate Current Logo Usage

**Priority:** HIGH  
**Status:** Pending

### Task 1.1: Search for Logo References
- [ ] Search codebase for `evielogo.svg`
- [ ] Search codebase for `eviemonologo.svg`
- [ ] Search for relative path patterns: `"/evielogo.svg"`, `"/eviemonologo.svg"`

### Task 1.2: Categorize Usage
- [ ] **React/TSX Components** (CRITICAL - affects embeddable bundle):
  - [ ] `src/components/ChatBot.tsx` - Line 360 (evielogo.svg)
  - [ ] `src/components/ChatBot.tsx` - Line 431 (eviemonologo.svg)
  - [ ] `src/components/ChatBotV2.tsx` - Line 361 (evielogo.svg)
  - [ ] `src/components/ChatBotV2.tsx` - Line 432 (eviemonologo.svg)
- [ ] **HTML/Meta Tags** (Less critical - only affects main SPA):
  - [ ] `index.html` - Lines 5, 12, 13, 19, 25, 93 (multiple references)
- [ ] **CSS/Stylesheets** (Check if any):
  - [ ] Search CSS files for `url("/evielogo.svg")` or similar
  - [ ] Search styled-components for background-image references
- [ ] **Documentation/Test Files** (Low priority):
  - [ ] Check if any docs reference these files

**Files Found:**
- ✅ `src/components/ChatBot.tsx` - 2 usages
- ✅ `src/components/ChatBotV2.tsx` - 2 usages  
- ✅ `index.html` - 6 usages (SPA only, less critical for embedding)

---

## STEP 2: Create Centralized Asset Constants

**Priority:** CRITICAL  
**Status:** Pending

### Task 2.1: Create Assets Configuration File
- [ ] Create `src/config/assets.ts` (or `src/constants/assets.ts`)
- [ ] Define base URL constant:
  ```ts
  export const ANNABEL_ASSET_BASE_URL = "https://eventumortho.click";
  ```
- [ ] Define logo URL constants:
  ```ts
  export const ANNABEL_COLOUR_LOGO_URL = `${ANNABEL_ASSET_BASE_URL}/evielogo.svg`;
  export const ANNABEL_MONO_LOGO_URL = `${ANNABEL_ASSET_BASE_URL}/eviemonologo.svg`;
  ```
- [ ] Add JSDoc comments explaining these are S3-hosted assets
- [ ] Export all constants for use in components

**Alternative:** If preferred, can hardcode full URLs:
```ts
export const ANNABEL_COLOUR_LOGO_URL = "https://eventumortho.click/evielogo.svg";
export const ANNABEL_MONO_LOGO_URL = "https://eventumortho.click/eviemonologo.svg";
```

---

## STEP 3: Update React Components

**Priority:** CRITICAL  
**Status:** Pending

### Task 3.1: Update ChatBot.tsx
- [ ] Import logo constants at top of file:
  ```ts
  import { ANNABEL_COLOUR_LOGO_URL, ANNABEL_MONO_LOGO_URL } from '../config/assets';
  ```
- [ ] Replace line 360:
  ```ts
  // Before: <img src="/evielogo.svg" ... />
  // After:  <img src={ANNABEL_COLOUR_LOGO_URL} ... />
  ```
- [ ] Replace line 431:
  ```ts
  // Before: <img src="/eviemonologo.svg" ... />
  // After:  <img src={ANNABEL_MONO_LOGO_URL} ... />
  ```
- [ ] Verify no other relative paths remain in this file

### Task 3.2: Update ChatBotV2.tsx
- [ ] Import logo constants at top of file:
  ```ts
  import { ANNABEL_COLOUR_LOGO_URL, ANNABEL_MONO_LOGO_URL } from '../config/assets';
  ```
- [ ] Replace line 361:
  ```ts
  // Before: <img src="/evielogo.svg" ... />
  // After:  <img src={ANNABEL_COLOUR_LOGO_URL} ... />
  ```
- [ ] Replace line 432:
  ```ts
  // Before: <img src="/eviemonologo.svg" ... />
  // After:  <img src={ANNABEL_MONO_LOGO_URL} ... />
  ```
- [ ] Verify no other relative paths remain in this file

### Task 3.3: Verify Component Updates
- [ ] Run TypeScript compiler to check for import errors
- [ ] Verify all `<img src="/evielogo.svg"` references are replaced
- [ ] Verify all `<img src="/eviemonologo.svg"` references are replaced

---

## STEP 4: Update CSS/Styled Components (If Needed)

**Priority:** MEDIUM  
**Status:** Pending

### Task 4.1: Check for CSS References
- [ ] Search all CSS files for `url("/evielogo.svg")`
- [ ] Search all CSS files for `url("/eviemonologo.svg")`
- [ ] Search styled-components for background-image with relative paths

### Task 4.2: Update CSS References (If Found)
**Option A (Preferred):** Move to inline styles in React components
- [ ] Import logo constants in component
- [ ] Use inline style: `style={{ backgroundImage: `url(${ANNABEL_COLOUR_LOGO_URL})` }}`
- [ ] Keep CSS for other properties (background-size, background-repeat, etc.)

**Option B (If CSS-only):** Update CSS with absolute URL
- [ ] Change `url("/evielogo.svg")` to `url("https://eventumortho.click/evielogo.svg")`
- [ ] Change `url("/eviemonologo.svg")` to `url("https://eventumortho.click/eviemonologo.svg")`

---

## STEP 5: Update index.html (Optional - SPA Only)

**Priority:** LOW  
**Status:** Pending

**Note:** `index.html` is for the main SPA app, not the embeddable bundle. These updates are less critical but recommended for consistency.

### Task 5.1: Update Meta Tags
- [ ] Line 5: Update favicon link to absolute URL
- [ ] Lines 12-13: Update preload links to absolute URLs
- [ ] Line 19: Update og:image to absolute URL
- [ ] Line 25: Update twitter:image to absolute URL
- [ ] Line 93: Update loading spinner img src to absolute URL

**Example:**
```html
<!-- Before -->
<link rel="icon" type="image/svg+xml" href="/evielogo.svg" />
<link rel="preload" href="/evielogo.svg" as="image" type="image/svg+xml" />
<meta property="og:image" content="/evielogo.svg" />

<!-- After -->
<link rel="icon" type="image/svg+xml" href="https://eventumortho.click/evielogo.svg" />
<link rel="preload" href="https://eventumortho.click/evielogo.svg" as="image" type="image/svg+xml" />
<meta property="og:image" content="https://eventumortho.click/evielogo.svg" />
```

---

## STEP 6: Verify No Residual Relative Paths

**Priority:** HIGH  
**Status:** Pending

### Task 6.1: Final Search
- [ ] Search again for `evielogo.svg` - should only find:
  - Constant definitions in `src/config/assets.ts`
  - Absolute URLs in `index.html` (if updated)
  - Documentation/test files (acceptable)
- [ ] Search again for `eviemonologo.svg` - same expectations
- [ ] Search for `"/evielogo.svg"` - should find none in production code
- [ ] Search for `"/eviemonologo.svg"` - should find none in production code

### Task 6.2: Code Review
- [ ] Review all React component files for any missed references
- [ ] Check that all imports are correct
- [ ] Verify TypeScript compilation succeeds

---

## STEP 7: Rebuild and Test Locally

**Priority:** CRITICAL  
**Status:** Pending

### Task 7.1: Build Library Bundle
- [ ] Run `npm run build:lib`
- [ ] Verify build succeeds without errors
- [ ] Check that `dist/evi-chatbot.js` is created

### Task 7.2: Test with embed-test.html
- [ ] Open `embed-test.html` in browser (or use local server)
- [ ] Open chatbot using `window.EviChatBot.init()`
- [ ] Open browser DevTools → Network tab
- [ ] Verify requests are made to:
  - ✅ `https://eventumortho.click/evielogo.svg`
  - ✅ `https://eventumortho.click/eviemonologo.svg`
- [ ] Verify NO requests to:
  - ❌ `/evielogo.svg` (relative path)
  - ❌ `/eviemonologo.svg` (relative path)
- [ ] Check Console for errors

### Task 7.3: Expected Behavior
**Before SVGs are uploaded to S3:**
- Requests to `https://eventumortho.click/evielogo.svg` will return 404 (expected)
- This is OK - the URLs are correct, just need to upload files

**After SVGs are uploaded to S3:**
- Requests should return 200 OK
- Logos should display correctly

---

## STEP 8: Upload SVGs to S3

**Priority:** CRITICAL  
**Status:** Pending  
**Note:** This is a manual step for the user, but documented here for completeness.

### Task 8.1: Locate SVG Files
- [ ] Find `evielogo.svg` in project (likely in `public/` or `src/assets/`)
- [ ] Find `eviemonologo.svg` in project

### Task 8.2: Upload to S3
- [ ] Upload `evielogo.svg` to S3 bucket `eventumortho.click`
- [ ] Upload `eviemonologo.svg` to S3 bucket `eventumortho.click`
- [ ] Verify files are publicly accessible at:
  - `https://eventumortho.click/evielogo.svg`
  - `https://eventumortho.click/eviemonologo.svg`
- [ ] Set appropriate cache headers (e.g., `Cache-Control: public, max-age=31536000`)

**AWS CLI Example:**
```bash
aws s3 cp public/evielogo.svg s3://eventumortho.click/evielogo.svg \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/svg+xml"

aws s3 cp public/eviemonologo.svg s3://eventumortho.click/eviemonologo.svg \
  --cache-control "public, max-age=31536000, immutable" \
  --content-type "image/svg+xml"
```

---

## STEP 9: Deploy Updated Bundle

**Priority:** CRITICAL  
**Status:** Pending

### Task 9.1: Build for Production
- [ ] Run `npm run build:lib`
- [ ] Verify `dist/evi-chatbot.js` is updated

### Task 9.2: Deploy to S3
- [ ] Upload `dist/evi-chatbot.js` to S3
- [ ] Verify deployment succeeded

---

## STEP 10: Test WordPress Integration

**Priority:** HIGH  
**Status:** Pending

### Task 10.1: Test on WordPress Site
- [ ] Navigate to WordPress test site
- [ ] Open chatbot page
- [ ] Click launch button to open chatbot

### Task 10.2: Verify in DevTools
- [ ] Open browser DevTools → Console
- [ ] Verify NO errors related to logos
- [ ] Open DevTools → Network tab
- [ ] Verify requests to:
  - ✅ `https://eventumortho.click/evielogo.svg` (200 OK)
  - ✅ `https://eventumortho.click/eviemonologo.svg` (200 OK)
- [ ] Verify NO 404s from WordPress origin:
  - ❌ `http://35.179.152.244/evielogo.svg` (should not be requested)
  - ❌ `http://35.179.152.244/eviemonologo.svg` (should not be requested)

### Task 10.3: Visual Verification
- [ ] Verify logos display correctly in chatbot header
- [ ] Verify logos display correctly in message bubbles
- [ ] Verify no broken image icons

---

## Final Checklist

### Code Changes
- [ ] `src/config/assets.ts` created with logo URL constants
- [ ] `src/components/ChatBot.tsx` updated to use constants
- [ ] `src/components/ChatBotV2.tsx` updated to use constants
- [ ] `index.html` updated (optional, for SPA consistency)
- [ ] No relative path references remain in production code

### Build & Deploy
- [ ] Library bundle rebuilt successfully
- [ ] Local testing confirms correct URLs
- [ ] SVGs uploaded to S3
- [ ] Updated bundle deployed to S3

### Verification
- [ ] Network tab shows requests to `https://eventumortho.click/...`
- [ ] No 404s from host site origin
- [ ] Logos display correctly in embedded chatbot
- [ ] WordPress integration works without errors

---

## Success Criteria

✅ All logo references use absolute URLs from `https://eventumortho.click/`  
✅ No relative path references (`/evielogo.svg`) in production code  
✅ Network requests go to S3, not host site origin  
✅ Logos display correctly when chatbot is embedded  
✅ No console errors related to missing logos  
✅ WordPress integration works without 404s

---

## Notes

- **Embeddable Bundle Priority:** The React components (`ChatBot.tsx`, `ChatBotV2.tsx`) are CRITICAL as they're part of the embeddable bundle
- **SPA Files:** `index.html` updates are optional but recommended for consistency
- **S3 Upload:** User must manually upload SVGs to S3 (not automated)
- **Testing:** Can test URL correctness before SVGs are uploaded (will get 404, but URLs are correct)

