# Version Management Analysis

## Current State

**Version is duplicated in 4 locations:**
1. `public/evi-chatbot-loader.js` - Standalone JS file (deployed as-is)
2. `src/chatbotLoader.ts` - TypeScript utility
3. `eo-chatbot-kit/chatbotLoader.ts` - Kit TypeScript file
4. `eo-chatbot-kit/chatbotLoader.js` - Kit JS file

**Version is hardcoded in documentation:**
- README.md
- EOChatbotcaller.md
- loader-test.md
- eo-chatbot-kit/snippet.html

---

## Pros of Centralized Version

✅ **Single Source of Truth**
- Update once, affects all code files
- No risk of forgetting to update one location
- Easier to maintain

✅ **Type Safety**
- TypeScript files can import and get type checking
- IDE autocomplete and refactoring support

✅ **Build-Time Injection**
- Can inject version into standalone files during build
- Can generate documentation with current version
- Automated version bumping possible

✅ **Consistency**
- Guaranteed same version across all files
- Less human error

---

## Cons/Challenges

❌ **Loader File is Standalone**
- `public/evi-chatbot-loader.js` is deployed directly (not built by Vite)
- Can't use ES6 imports (needs to work in any browser)
- Would need build-time processing to inject version

❌ **Documentation Files**
- Markdown files can't import TypeScript/JS
- Would need template processing or manual updates
- Or accept that docs need manual version updates

❌ **Kit Files**
- `eo-chatbot-kit/` is meant to be copyable/standalone
- If we generate them, they're no longer "drop-in" files
- Could keep as-is or generate at build time

❌ **Additional Build Step**
- Need to add version injection script
- Adds complexity to build process
- One more thing that could break

---

## Recommended Solution

### Option 1: Centralized Version with Build-Time Injection (Recommended)

**Structure:**
```
src/
  version.ts          # Single source of truth
  chatbotLoader.ts    # Imports from version.ts
public/
  evi-chatbot-loader.js.template  # Template with placeholder
scripts/
  inject-version.js   # Build script to inject version
eo-chatbot-kit/
  chatbotLoader.ts    # Imports from version.ts (or generated)
```

**Pros:**
- Single source of truth for code
- Automated version injection
- Type-safe in TypeScript files
- Can generate kit files at build time

**Cons:**
- More complex build process
- Loader file needs template + build step
- Kit files need generation or manual sync

### Option 2: Centralized Version for Code Only (Simpler)

**Structure:**
```
src/
  version.ts          # Single source of truth
  chatbotLoader.ts    # Imports from version.ts
public/
  evi-chatbot-loader.js  # Keep version constant (manual update)
eo-chatbot-kit/
  chatbotLoader.ts    # Imports from version.ts
```

**Pros:**
- Simple - no build-time processing needed
- TypeScript files use centralized version
- Loader file still has version (just one place to update)

**Cons:**
- Still need to manually update loader file
- Kit JS file still needs manual update
- Documentation still manual

### Option 3: Use package.json Version

**Structure:**
```
package.json          # version: "2025.12.12.01"
src/
  version.ts          # Reads from package.json
scripts/
  inject-version.js   # Reads package.json and injects
```

**Pros:**
- Standard npm version management
- Can use `npm version` command
- Single source in package.json

**Cons:**
- Version format might not match (semver vs date-based)
- Still need injection for loader file
- More complex

---

## My Recommendation: **Option 2 (Simpler Approach)**

**Why:**
1. **Pragmatic** - Balances benefits with simplicity
2. **TypeScript files** get centralized version (most important)
3. **Loader file** - Only one manual update needed (acceptable)
4. **No build complexity** - Works with current setup
5. **Easy to upgrade** - Can add build-time injection later if needed

**Implementation:**
1. Create `src/version.ts` with version constant
2. Update TypeScript files to import from `version.ts`
3. Keep loader file with version constant (one manual update)
4. Keep kit JS file with version constant (one manual update)
5. Documentation stays manual (acceptable for docs)

**Future Enhancement:**
- Can add build script later to auto-inject into loader file
- Can generate kit files from templates
- Can use package.json version if desired

---

## Implementation Plan

1. Create `src/version.ts`
2. Update `src/chatbotLoader.ts` to import version
3. Update `eo-chatbot-kit/chatbotLoader.ts` to import version
4. Keep `public/evi-chatbot-loader.js` with constant (manual update)
5. Keep `eo-chatbot-kit/chatbotLoader.js` with constant (manual update)
6. Add comment in loader files pointing to `src/version.ts` as source of truth

