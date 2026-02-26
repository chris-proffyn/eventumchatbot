# Annabel Chatbot - WordPress Integration Guide

Complete guide for integrating the Annabel chatbot into WordPress websites using a proper WordPress plugin approach. The chatbot is triggered from buttons, links, or any element on your site (e.g., a button in the header). **The chatbot does not auto-load** - it only appears when triggered by user interaction.

## Important: WordPress Limitations

**WordPress does NOT reliably allow uploading `.js` files via the Media Library.** Many WordPress installations block JavaScript file uploads for security reasons. Additionally, manually adding script tags to pages is not a maintainable or production-ready approach.

**The recommended approach is to create a WordPress plugin that uses `wp_enqueue_script()` to properly load the chatbot from a CDN/S3 URL.**

---

## WordPress Installation (Recommended / Production)

This section provides the canonical, production-ready method for integrating the Annabel chatbot into WordPress.

### Step 1: Create Plugin Directory

1. Access your WordPress installation via FTP/SFTP or file manager
2. Navigate to `wp-content/plugins/`
3. Create a new directory: `annabel-chatbot`
4. Full path should be: `wp-content/plugins/annabel-chatbot/`

### Step 2: Create Plugin PHP File

1. Inside `annabel-chatbot/`, create a file named `annabel-chatbot.php`
2. Copy and paste the following code:

```php
<?php
/**
 * Plugin Name: Annabel Chatbot
 * Plugin URI: https://eventumortho.click
 * Description: Integrates the Annabel chatbot into WordPress. Loads chatbot from CDN and exposes openAnnabelChat() and closeAnnabelChat() functions.
 * Version: 1.0.0
 * Author: Eventum Orthopaedics
 * License: Private
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue chatbot loader script and define wrapper functions
 */
function annabel_chatbot_enqueue_scripts() {
    // Load the chatbot loader from CDN/S3
    wp_enqueue_script(
        'annabel-chatbot-loader',
        'https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03',
        array(), // No dependencies
        '2025-12-12-03', // Version for cache busting
        true // Load in footer
    );
    
    // Define wrapper functions before loader runs
    // This ensures openAnnabelChat() and closeAnnabelChat() are available
    wp_add_inline_script(
        'annabel-chatbot-loader',
        "
        // Define wrapper functions that call EviChatBot API
        window.openAnnabelChat = function() {
            if (window.EviChatBot && typeof window.EviChatBot.init === 'function') {
                window.EviChatBot.init();
            } else {
                // Wait for loader to finish
                var attempts = 0;
                var checkInterval = setInterval(function() {
                    attempts++;
                    if (window.EviChatBot && typeof window.EviChatBot.init === 'function') {
                        window.EviChatBot.init();
                        clearInterval(checkInterval);
                    } else if (attempts > 50) {
                        clearInterval(checkInterval);
                        console.error('Annabel Chatbot: Failed to load after 5 seconds');
                    }
                }, 100);
            }
        };
        
        window.closeAnnabelChat = function() {
            if (window.EviChatBot && typeof window.EviChatBot.close === 'function') {
                window.EviChatBot.close();
            }
        };
        ",
        'before' // Execute before the loader script
    );
}
add_action('wp_enqueue_scripts', 'annabel_chatbot_enqueue_scripts');
```

3. Save the file

### Step 3: Activate the Plugin

1. Log in to your WordPress admin dashboard
2. Go to `Plugins → Installed Plugins`
3. Find **"Annabel Chatbot"** in the list
4. Click **"Activate"**

### Step 4: Add a Button to Your Site

The plugin loads the chatbot loader and defines `openAnnabelChat()` and `closeAnnabelChat()` functions. Now you need to add a button that calls `openAnnabelChat()`.

#### Option A: Add Button via Custom HTML Widget (Header)

1. Go to `Appearance → Widgets` (or `Appearance → Customize → Widgets`)
2. Add a **"Custom HTML"** widget to your header area
3. Paste this code:

```html
<button id="annabel-chat-button" onclick="openAnnabelChat();" style="padding: 10px 20px; background-color: #053159; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
  Chat to Annabel
</button>
```

4. Click **"Save"**

#### Option B: Add Button via Theme Customizer

1. Go to `Appearance → Customize`
2. Navigate to **"Additional CSS"** or your theme's header section
3. Add a **"Custom HTML"** block where you want the button
4. Paste the button code from Option A above

#### Option C: Add Button via Menu Item

1. Go to `Appearance → Menus`
2. Add a **"Custom Link"**
3. **URL**: `#`
4. **Link Text**: "Chat to Annabel"
5. Add CSS class: `annabel-chat-trigger`
6. Save the menu
7. Add this JavaScript to your site (via "Insert Headers and Footers" plugin or Code Snippets):

```javascript
<script>
document.addEventListener('DOMContentLoaded', function() {
    var triggers = document.querySelectorAll('.annabel-chat-trigger');
    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openAnnabelChat();
        });
    });
});
</script>
```

---

## How It Works

### Script Loading Flow

1. **Plugin activates** → `annabel_chatbot_enqueue_scripts()` runs
2. **`wp_add_inline_script()`** defines `openAnnabelChat()` and `closeAnnabelChat()` **before** the loader loads
3. **`wp_enqueue_script()`** loads `evi-chatbot-loader.js` from CDN
4. **Loader script** loads `evi-chatbot.js` and exposes `window.EviChatBot.init()` and `window.EviChatBot.close()`
5. **Wrapper functions** (`openAnnabelChat()` / `closeAnnabelChat()`) call the `EviChatBot` API

### Function Reference

#### `openAnnabelChat()`

Opens the chatbot window. Safe to call multiple times (prevents duplicates).

**Usage:**
```html
<button onclick="openAnnabelChat();">Chat to Annabel</button>
```

#### `closeAnnabelChat()`

Closes the chatbot window if it's open.

**Usage:**
```html
<button onclick="closeAnnabelChat();">Close Chat</button>
```

---

## Verification

### Step 1: Check Functions Are Defined

1. Open your WordPress site in a browser
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Type: `typeof openAnnabelChat`
5. **Expected result**: `"function"`

If you see `"undefined"`, the plugin is not active or the script is not loading.

### Step 2: Check Script Loading

1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Filter by "evi-chatbot"
4. **Expected requests**:
   - `evi-chatbot-loader.js?v=2025-12-12-03` → Status: 200
   - `evi-chatbot.js?v=2025-12-12-03` → Status: 200 (loaded by loader)

### Step 3: Test Button Click

1. Click your chatbot button
2. **Expected behavior**:
   - Chatbot window appears in bottom-right corner
   - Size: 500px × 600px (resizable)
   - No console errors

### Step 4: Verify EviChatBot API

1. In Console, type: `typeof window.EviChatBot`
2. **Expected result**: `"object"`
3. Type: `typeof window.EviChatBot.init`
4. **Expected result**: `"function"`

---

## Common Failure Modes

### Button Renders But Does Nothing

**Symptom**: Button appears on page, but clicking it does nothing.

**Causes:**
- Plugin is not activated
- `openAnnabelChat()` is not defined
- JavaScript error preventing function execution

**Solution:**
1. Verify plugin is active: `Plugins → Installed Plugins` → "Annabel Chatbot" should show "Active"
2. Check Console for errors: `F12 → Console` → Look for red errors
3. Verify function exists: In Console, type `typeof openAnnabelChat` → Should return `"function"`
4. If function is undefined, deactivate and reactivate the plugin

### Loader Included But Chat Doesn't Open

**Symptom**: `openAnnabelChat()` exists, but chatbot window doesn't appear.

**Causes:**
- `evi-chatbot-loader.js` failed to load
- `evi-chatbot.js` failed to load
- `window.EviChatBot.init()` is not available

**Solution:**
1. Check Network tab: Verify `evi-chatbot-loader.js` and `evi-chatbot.js` both return 200 status
2. Check Console: Look for "Failed to load" errors
3. Verify `window.EviChatBot` exists: In Console, type `window.EviChatBot` → Should return an object
4. Try manual init: In Console, type `window.EviChatBot.init()` → Should open chatbot
5. If manual init works but button doesn't, check button's `onclick` attribute

### CORS Issues

**Symptom**: Console shows CORS errors when chatbot tries to send messages.

**Causes:**
- Proxy origin not set correctly
- Cloudflare Worker proxy not accessible

**Solution:**
1. The chatbot uses Cloudflare Worker proxy: `https://eo-chatbot-cors-proxy.proffyn-chat.workers.dev`
2. CORS is handled automatically by the proxy
3. If CORS errors persist, verify the proxy URL in the chatbot bundle (check Network tab for actual requests)
4. Ensure your site's Content Security Policy allows `https://eventumortho.click` and `https://eo-chatbot-cors-proxy.proffyn-chat.workers.dev`

### Multiple Chatbot Windows

**Symptom**: Multiple chatbot windows appear when clicking the button.

**Causes:**
- Plugin loaded multiple times
- Script included in multiple places
- Duplicate button handlers

**Solution:**
1. Ensure plugin is only activated once
2. Check that you haven't manually added the loader script elsewhere
3. The loader includes duplicate prevention - if duplicates appear, check for multiple plugin instances or conflicting code

### Script Not Loading (404 Errors)

**Symptom**: Network tab shows 404 for `evi-chatbot-loader.js` or `evi-chatbot.js`.

**Causes:**
- Incorrect URL in plugin
- CDN/S3 bucket not accessible
- Version parameter incorrect

**Solution:**
1. Verify URL in plugin file: Should be `https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03`
2. Test URL directly in browser: Should return JavaScript content
3. Check version parameter: Update to latest version if needed
4. Verify CloudFront distribution is active (if using CloudFront)

---

## Technical Details

### Plugin Structure

```
wp-content/plugins/annabel-chatbot/
└── annabel-chatbot.php
```

### Script URLs

- **Loader**: `https://eventumortho.click/evi-chatbot-loader.js?v=2025-12-12-03`
- **Chatbot Bundle**: `https://eventumortho.click/evi-chatbot.js?v=2025-12-12-03` (loaded by loader)
- **API Endpoint**: `https://eo-chatbot-cors-proxy.proffyn-chat.workers.dev`

### Global Functions

- `window.openAnnabelChat()` - Opens the chatbot
- `window.closeAnnabelChat()` - Closes the chatbot
- `window.EviChatBot.init()` - Low-level API (called by wrapper)
- `window.EviChatBot.close()` - Low-level API (called by wrapper)

### Chatbot Window

- **Default size**: 500px × 600px
- **Min size**: 300px × 400px
- **Max size**: 90vw × 90vh
- **Resizable**: Yes (drag bottom-right corner)
- **Position**: Fixed, bottom-right (20px from edges)
- **Container ID**: `#evi-chat-container`

---

## Updating the Plugin

When a new chatbot version is released:

1. Edit `annabel-chatbot.php`
2. Update the version number in two places:
   - `wp_enqueue_script()` version parameter: `'2025-12-12-03'` → `'NEW-VERSION'`
   - URL query parameter: `?v=2025-12-12-03` → `?v=NEW-VERSION`
3. Save the file
4. Clear any caching plugins (if used)

---

## Support

For issues or questions:

1. **Verify plugin is active**: `Plugins → Installed Plugins`
2. **Check browser console**: `F12 → Console` for errors
3. **Check Network tab**: Verify scripts are loading (200 status)
4. **Test functions manually**: In Console, type `openAnnabelChat()` and press Enter
5. **Verify WordPress version**: Tested on WordPress 5.8+ and default themes (Twenty Twenty-Five)

---

**Last Updated**: 2025-12-12  
**Chatbot Version**: 2025-12-12-03  
**Plugin Version**: 1.0.0
