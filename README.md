# Simple Password Strength Checker

A beginner-friendly password strength checker made with **HTML, CSS and JavaScript**. No frameworks, accounts, databases, or package installation are needed.

## Run the website

1. Unzip the folder.
2. Double-click `index.html` to open it in your browser.
3. Enter a **test password** to see the strength score, checklist, entropy and suggestions.

## Files

- `index.html` — the page layout.
- `style.css` — fonts, colors, spacing and mobile layout.
- `script.js` — password checks, score, entropy and interface updates.
- `test.js` — optional tests; run `node test.js` if you have Node.js.

## How the password score works

Points are added for length and character variety. Points are removed for common words, sequences and repeated characters. The result is clamped between 0 and 100. This is a simple educational heuristic, **not a guarantee of security**. Dictionary and pattern lists are intentionally small and may miss weak passwords.

Shannon entropy is calculated using:

`H = -sum(p(x) * log2(p(x)))`

Here `p(x)` is the frequency of each different character in the entered password. The result shown is **bits per character**; it does not reliably estimate guessing difficulty. For a complete security product, consider proven strength-estimation libraries and breached-password screening with privacy-preserving methods.

## Privacy

Password checking takes place in the browser. The application has no network requests, analytics, backend, cookies or localStorage. Password input is not deliberately saved or logged. JavaScript strings may remain in volatile memory until cleared by the browser; the app cannot promise memory wiping.

## Tests

With Node.js installed, run:

```bash
node test.js
```

To see the application online, host these static files using GitHub Pages.
