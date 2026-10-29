// A simple password checker. Everything happens in the browser.
const passwordInput = typeof document === "undefined" ? null : document.getElementById("password");
const result = (typeof document === "undefined" ? null : document.getElementById("result"));
const meter = (typeof document === "undefined" ? null : document.getElementById("meterFill"));
const entropyText = (typeof document === "undefined" ? null : document.getElementById("entropy"));
const advice = (typeof document === "undefined" ? null : document.getElementById("advice"));

const commonWords = ["password", "admin", "welcome", "letmein", "qwerty", "football", "iloveyou", "123456"];

function shannonEntropy(password) {
  // Shannon entropy = -sum(probability * log2(probability))
  if (!password) return 0;
  let total = 0;
  for (const letter of new Set(password)) {
    const count = [...password].filter(c => c === letter).length;
    const chance = count / [...password].length;
    total -= chance * Math.log2(chance);
  }
  return total;
}

function analyzePassword(password) {
  const checks = {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password)
  };

  // Change common substitutions back into letters for dictionary checks.
  const simplified = password.toLowerCase()
    .replace(/@/g, "a").replace(/0/g, "o").replace(/1/g, "i")
    .replace(/3/g, "e").replace(/\$/g, "s").replace(/5/g, "s");

  const common = commonWords.some(word => password.toLowerCase().includes(word) || simplified.includes(word));
  const repeated = /(.)\1\1/.test(password);
  const sequence = /(1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwerty|asdf)/i.test(password);

  let score = 0;
  if (password.length >= 8) score += 20;
  if (checks.length) score += 20;
  if (password.length >= 16) score += 15;
  if (checks.upper) score += 10;
  if (checks.lower) score += 10;
  if (checks.number) score += 10;
  if (checks.symbol) score += 15;
  if (common) score -= 45;
  if (repeated) score -= 20;
  if (sequence) score -= 25;
  score = Math.max(0, Math.min(100, score));

  const suggestions = [];
  if (!checks.length) suggestions.push("Use at least 12 characters (16 or more is better).");
  if (!checks.upper || !checks.lower || !checks.number || !checks.symbol)
    suggestions.push("Mix uppercase, lowercase, numbers and symbols.");
  if (common) suggestions.push("Avoid common passwords and words, even with substitutions like @ for a.");
  if (repeated) suggestions.push("Avoid repeating the same character three times in a row.");
  if (sequence) suggestions.push("Avoid predictable sequences and keyboard patterns.");
  if (suggestions.length === 0) suggestions.push("Good start. Use a unique password for each account.");

  let label = "Weak";
  if (score >= 80) label = "Strong";
  else if (score >= 50) label = "Moderate";
  return { checks, score, label, suggestions, entropy: shannonEntropy(password) };
}

function updatePage() {
  const password = passwordInput.value;
  if (!password) {
    result.textContent = "Start typing to check your password.";
    meter.style.width = "0";
    entropyText.textContent = "Shannon entropy: —";
    advice.textContent = "Suggestions will appear here.";
    for (const id of ["length", "upper", "lower", "number", "symbol"]) document.getElementById(id).className = "fail";
    return;
  }
  const analysis = analyzePassword(password);
  result.textContent = `${analysis.label} password (${analysis.score}/100)`;
  meter.style.width = analysis.score + "%";
  meter.style.background = analysis.score >= 80 ? "#239c5a" : analysis.score >= 50 ? "#e1a12b" : "#e04c4c";
  entropyText.textContent = `Shannon entropy: ${analysis.entropy.toFixed(2)} bits per character (not a cracking-time estimate)`;
  advice.textContent = analysis.suggestions.join(" ");
  for (const [id, passed] of Object.entries(analysis.checks)) {
    document.getElementById(id).className = passed ? "pass" : "fail";
    document.getElementById(id).textContent = (passed ? "✓ " : "○ ") + {
      length: "At least 12 characters", upper: "Uppercase letter", lower: "Lowercase letter",
      number: "Number", symbol: "Special character"
    }[id];
  }
}

if (typeof document !== "undefined") {
passwordInput.addEventListener("input", updatePage);
document.getElementById("toggle").addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  document.getElementById("toggle").textContent = hidden ? "Hide" : "Show";
});
updatePage();
}

// Export only for simple Node.js tests; not needed when opening index.html.
if (typeof module !== "undefined") module.exports = { analyzePassword, shannonEntropy };
