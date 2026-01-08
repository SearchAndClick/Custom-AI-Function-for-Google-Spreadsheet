/**
 * Generate a detailed task list and man-hour estimation.
 *
 * SETUP:
 * 1. Project Settings > Script Properties.
 * 2. Add 'GEMINI_API_KEY' : 'your_key_here'.
 *
 * Model: gemini-2.5-flash (hardcoded; change modelName constant to switch).
 *
 * @param {string} inputData Deskripsi input (Requirements).
 * @param {string} outputData Deskripsi output (Deliverables).
 * @param {string} remarks Catatan tambahan (Constraints).
 * @return {any[][]|string} 2D array rows: [Task, Hours] (spills down into columns) or Error string.
 * @customfunction
 */
function GENERATE_ESTIMATION(inputData, outputData, remarks) {
  // 1. Handle Empty Cells (Clean UI)
  if (!inputData && !outputData) return "";
  if (!inputData || !outputData) return "⚠️ Warning: Input dan Output wajib diisi keduanya.";
  
  if (!remarks) remarks = "Tidak ada catatan khusus";

  // 2. Load Config (Secure & Flexible)
  const apiKey = getScriptProperty_("GEMINI_API_KEY", true);
  if (apiKey.startsWith("Error")) return apiKey;

  // Default ke Flash (cepat). Untuk ganti model, ubah konstanta modelName.
  const modelName = "gemini-2.5-flash";
  const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // Cache: reduce repeated API calls for identical inputs
  const cacheKey = buildCacheKey_(modelName, inputData, outputData, remarks);
  const cached = getCachedResult_(cacheKey);
  if (cached) {
    const parsedCached = extractJsonArray_(cached);
    if (parsedCached) return normalizeTable_(parsedCached);
  }

  // 3. Construct Prompt
  const prompt = `
    Role: Senior Technical Project Manager & Solutions Architect.
    Context:
    - Input: "${inputData}"
    - Output: "${outputData}"
    - Remarks: "${remarks}"

    Task:
    Analyze requirements deeply. Break down work into a granular, sequential technical task list.
    Estimate realistic man-hours for a mid-level developer.

    STRICT OUTPUT FORMAT (JSON Array of Arrays ONLY):
    - Example: [["Setup PostgreSQL Schema", 2.5], ["Develop Auth API", 4.0]]
    - Each item MUST be: [Task Description (string), Estimated Hours (number)]
    - Task Description must be plain text (no bullet prefix like "-" or numbering).
    - NO Markdown (no \`\`\`json).
    - NO Intro/Outro text.
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 } // Low temp for consistency
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // 4. Execute & Parse
  try {
    // De-duplicate concurrent recalculations for the same input
    const lock = LockService.getScriptLock();
    lock.waitLock(2000);
    try {
      // Re-check cache after acquiring lock
      const cachedAfterLock = getCachedResult_(cacheKey);
      if (cachedAfterLock) {
        const parsedCached2 = extractJsonArray_(cachedAfterLock);
        if (parsedCached2) return normalizeTable_(parsedCached2);
      }

      const response = fetchWithRetry_(modelUrl, options, 3);
      const jsonResponse = JSON.parse(response.getContentText());

      if (jsonResponse.error) {
        return `API Error (${modelName}): ${jsonResponse.error.message}`;
      }

      const rawText = extractCandidateText_(jsonResponse);
      if (!rawText) return "Error: AI response is empty.";

      const jsonArray = extractJsonArray_(rawText);
      if (!jsonArray) return "Error: AI response is not a valid JSON array.";

      const table = normalizeTable_(jsonArray);
      if (typeof table === "string") return table;

      // Cache normalized table (array-of-arrays)
      setCachedResult_(cacheKey, JSON.stringify(table), 6 * 60 * 60);
      return table;
    } finally {
      lock.releaseLock();
    }

  } catch (e) {
    return "System Error: " + e.toString();
  }
}

// --- HELPER FUNCTIONS (MODULAR) ---

function getScriptProperty_(key, isRequired) {
  const val = PropertiesService.getScriptProperties().getProperty(key);
  if (isRequired && !val) {
    return `Error: Property '${key}' missing in Project Settings.`;
  }
  return val;
}

function extractCandidateText_(jsonResponse) {
  try {
    return jsonResponse.candidates[0].content.parts[0].text;
  } catch (e) {
    return null;
  }
}

function extractJsonArray_(text) {
  // Remove markdown code blocks
  let cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
  
  // Find the first '[' and last ']' to isolate JSON
  const firstBracket = cleanText.indexOf("[");
  const lastBracket = cleanText.lastIndexOf("]");
  
  if (firstBracket === -1 || lastBracket === -1) return null;
  
  cleanText = cleanText.substring(firstBracket, lastBracket + 1);

  try {
    return JSON.parse(cleanText);
  } catch (e) {
    return null;
  }
}

function normalizeTable_(data) {
  if (!Array.isArray(data)) return "Error: Output is not an array.";
  
  const cleanRows = [];
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    // Ensure row has at least 2 columns (Task, Hours)
    if (Array.isArray(row) && row.length >= 2) {
      const task = String(row[0]).trim();
      const hours = parseFloat(row[1]); // Ensure it's a number
      
      if (task && !isNaN(hours)) {
        cleanRows.push([task, hours]);
      }
    }
  }
  
  return cleanRows.length > 0 ? cleanRows : "Error: No valid tasks found.";
}

function buildCacheKey_(modelName, inputData, outputData, remarks) {
  const raw = [String(modelName), String(inputData), String(outputData), String(remarks)].join("\n---\n");
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
  const encoded = Utilities.base64EncodeWebSafe(digest);
  return "GE:" + encoded;
}

function getCachedResult_(cacheKey) {
  try {
    return CacheService.getScriptCache().get(cacheKey);
  } catch (e) {
    return null;
  }
}

function setCachedResult_(cacheKey, value, ttlSeconds) {
  try {
    CacheService.getScriptCache().put(cacheKey, value, ttlSeconds);
  } catch (e) {
    // ignore cache failures
  }
}

function fetchWithRetry_(url, options, maxAttempts) {
  let lastErr = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const resp = UrlFetchApp.fetch(url, options);
      const code = resp.getResponseCode();
      if (code === 429 || code >= 500) {
        // transient
        Utilities.sleep(250 * attempt);
        continue;
      }
      return resp;
    } catch (e) {
      lastErr = e;
      Utilities.sleep(250 * attempt);
    }
  }
  if (lastErr) throw lastErr;
  throw new Error("Fetch failed");
}