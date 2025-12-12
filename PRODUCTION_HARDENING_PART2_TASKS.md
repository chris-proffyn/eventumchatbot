# Production Hardening Part 2 - Task List

This document outlines tasks to implement two critical production improvements:
1. **Versioned JS URLs** for cache-busting
2. **True production Vite build** (remove React DevTools & process dependencies)

---

## PART 1: Implement Versioned JS URLs (Cache Busting)

### Task 1.1: Audit All URL References
**Priority:** HIGH  
**Status:** Pending

- [ ] Search project for all references to:
  - `evi-chatbot.js`
  - `evi-chatbot-loader.js`
  - `https://eventumortho.click/evi-chatbot.js`
  - `https://eventumortho.click/evi-chatbot-loader.js`
- [ ] Document all files and line numbers where these URLs appear
- [ ] Categorize references:
  - Loader files (dynamic script injection)
  - Documentation files (README, guides)
  - Integration kit files
  - Test files

**Files Found (from initial search):**
- `public/evi-chatbot-loader.js` (line 23) - **CRITICAL**
- `src/chatbotLoader.ts` (line 11)
- `eo-chatbot-kit/chatbotLoader.ts` (line 11)
- `eo-chatbot-kit/chatbotLoader.js` (line 2)
- `eo-chatbot-kit/snippet.html` (line 2)
- `EOChatbotcaller.md` (multiple lines)
- `loader-test.md` (multiple lines)
- `README.md` (line 68)
- `embed-test.html` (line 50)

### Task 1.2: Add Version Constant to Loader
**Priority:** CRITICAL  
**Status:** Pending  
**File:** `public/evi-chatbot-loader.js`

- [ ] Add version constant at top of file:
  ```js
  // Bump this version string on each production release
  const ANNABEL_CHATBOT_VERSION = "2025-12-12-01";
  ```
- [ ] Update script.src to include version:
  ```js
  // Change from:
  loadScript('https://eventumortho.click/evi-chatbot.js', init);
  
  // To:
  loadScript(`https://eventumortho.click/evi-chatbot.js?v=${ANNABEL_CHATBOT_VERSION}`, init);
  ```
- [ ] Verify the loader file is updated correctly

### Task 1.3: Update TypeScript Loader Utilities
**Priority:** HIGH  
**Status:** Pending  
**Files:** 
- `src/chatbotLoader.ts`
- `eo-chatbot-kit/chatbotLoader.ts`
- `eo-chatbot-kit/chatbotLoader.js`

- [ ] Add version constant to each loader utility file
- [ ] Update default URL to include version parameter:
  ```ts
  const ANNABEL_CHATBOT_VERSION = "2025-12-12-01";
  const { src = `https://eventumortho.click/evi-chatbot-loader.js?v=${ANNABEL_CHATBOT_VERSION}` } = options;
  ```
- [ ] Ensure version is applied when constructing script URLs

### Task 1.4: Update Documentation Files
**Priority:** MEDIUM  
**Status:** Pending  
**Files:**
- `README.md`
- `EOChatbotcaller.md`
- `loader-test.md`
- `eo-chatbot-kit/README.md`
- `eo-chatbot-kit/snippet.html`

- [ ] Update all example script tags to include version:
  ```html
  <!-- Change from: -->
  <script src="https://eventumortho.click/evi-chatbot-loader.js" async></script>
  
  <!-- To: -->
  <script src="https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-01" async></script>
  ```
- [ ] Add note in documentation:
  > "Bump the `ANNABEL_CHATBOT_VERSION` constant and query parameter whenever you deploy a new version."
- [ ] Update README.md with versioning instructions

### Task 1.5: Update Test Files
**Priority:** LOW  
**Status:** Pending  
**File:** `embed-test.html`

- [ ] Update script src to include version parameter (if using CDN URL)
- [ ] Or keep relative path for local testing (document this)

### Task 1.6: Verification
**Priority:** HIGH  
**Status:** Pending

- [ ] Verify all dynamic loads of `evi-chatbot.js` include `?v=${ANNABEL_CHATBOT_VERSION}`
- [ ] Verify loader file uses version constant
- [ ] Test that version parameter works (load script with version)
- [ ] Document version bump process for future releases

---

## PART 2: Enforce True Production Build in Vite

### Task 2.1: Review Current Vite Config
**Priority:** HIGH  
**Status:** Pending  
**File:** `vite.lib.config.ts`

- [ ] Review current `vite.lib.config.ts` contents
- [ ] Note existing `define` block (already has `process.env.NODE_ENV`)
- [ ] Check if `esbuild` configuration exists

**Current State:**
- ✅ Has `define` block with `process.env.NODE_ENV`
- ❌ Missing `esbuild` configuration
- ❌ Missing `drop: ['console', 'debugger']`

### Task 2.2: Add esbuild Configuration
**Priority:** CRITICAL  
**Status:** Pending  
**File:** `vite.lib.config.ts`

- [ ] Add `esbuild` block to config:
  ```ts
  esbuild: {
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    drop: ['console', 'debugger'],
  },
  ```
- [ ] Ensure both `define` (top-level) and `esbuild.define` are present
- [ ] Verify config merges correctly (don't overwrite existing `define`)

### Task 2.3: Check for Dev-Runtime Imports
**Priority:** MEDIUM  
**Status:** Pending

- [ ] Search `src/` directory for:
  - `react/jsx-dev-runtime`
  - `jsxDEV`
  - Any dev-only React imports
- [ ] If found, replace with production equivalents:
  - `react/jsx-dev-runtime` → `react/jsx-runtime`
  - `jsxDEV` → `jsx` or `jsxs`
- [ ] Verify TypeScript config uses `jsx-runtime` (not dev-runtime)
- [ ] Check `tsconfig.json` for correct JSX settings

### Task 2.4: Rebuild and Inspect Bundle
**Priority:** CRITICAL  
**Status:** Pending

- [ ] Run build command:
  ```bash
  npm run build:lib
  ```
- [ ] Verify build succeeds without errors
- [ ] Inspect `dist/evi-chatbot.js` for the following strings:
  - [ ] `process.env.NODE_ENV` - should be **ZERO** occurrences
  - [ ] `process` - should be minimal (only in string literals/comments if any)
  - [ ] `__REACT_DEVTOOLS_GLOBAL_HOOK__` - should be **ZERO**
  - [ ] `checkDCE` - should be **ZERO**
  - [ ] `jsxDEV` - should be **ZERO**
  - [ ] `devtools` - should be **ZERO** (or only in comments)
- [ ] Verify bundle is minified
- [ ] Check bundle size (should be reasonable)

### Task 2.5: Update Test File (if needed)
**Priority:** LOW  
**Status:** Pending  
**File:** `embed-test.html`

- [ ] Verify `embed-test.html` exists (already created)
- [ ] Ensure it tests both `init()` and `close()` methods
- [ ] Document testing procedure

### Task 2.6: Final Verification
**Priority:** CRITICAL  
**Status:** Pending

- [ ] Open `embed-test.html` in browser (file:// or local server)
- [ ] Test scenarios:
  - [ ] No console errors on page load
  - [ ] No "process is not defined" errors
  - [ ] No React production warnings
  - [ ] Chatbot opens correctly (`window.EviChatBot.init()`)
  - [ ] Chatbot closes correctly (`window.EviChatBot.close()`)
  - [ ] Can reopen after closing
- [ ] Verify bundle works in:
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (if available)

---

## Final Checklist

### Versioning (Part 1)
- [ ] All dynamic loads of `evi-chatbot.js` use versioned URL with `?v=...`
- [ ] Single `ANNABEL_CHATBOT_VERSION` constant controls version
- [ ] Loader file (`evi-chatbot-loader.js`) uses version constant
- [ ] Documentation updated with version examples
- [ ] Version bump process documented

### Production Build (Part 2)
- [ ] `vite.lib.config.ts` has both `define` and `esbuild.define` for `process.env.NODE_ENV`
- [ ] `esbuild.drop` removes `console` and `debugger`
- [ ] No dev-runtime imports in source code
- [ ] Bundle contains **ZERO** references to:
  - `process.env.NODE_ENV` (runtime)
  - `__REACT_DEVTOOLS_GLOBAL_HOOK__`
  - `checkDCE`
  - `jsxDEV`
- [ ] Bundle is minified
- [ ] `embed-test.html` works without errors
- [ ] Global API (`window.EviChatBot.init()` / `close()`) works correctly

---

## Implementation Order

1. **Start with Part 2** (Production Build) - Higher impact, fixes runtime issues
   - Task 2.1 → 2.2 → 2.3 → 2.4 → 2.6
   
2. **Then Part 1** (Versioning) - Important for deployment but less critical for functionality
   - Task 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6

---

## Notes

- **Version Format:** Use `YYYY-MM-DD-NN` format (e.g., `2025-12-12-01`)
- **Version Bump:** Increment the last number for each release, or change date for major releases
- **Testing:** Always test locally before deploying to S3
- **Deployment:** After version bump, deploy both loader and main bundle to S3

---

## Success Criteria

✅ Bundle runs in plain HTML without any shims  
✅ No `process` runtime dependencies  
✅ No React DevTools code in production bundle  
✅ All URLs are versioned for cache-busting  
✅ Documentation is up-to-date  
✅ Bundle is production-ready for commercial deployment

