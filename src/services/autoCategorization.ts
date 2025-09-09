import { BunqTransactionResponse } from "@/types/bunq/transactions";

export interface CategoryFilter {
  keywords: string[];
  merchantPatterns: string[];
  amountRanges: { min?: number; max?: number }[];
  excludeKeywords: string[];
}

export interface BudgetCategory {
  id: number;
  name: string;
  autoCategorizeFilters?: string;
}

export interface CategorizationMatch {
  categoryId: number;
  categoryName: string;
  confidence: number;
  matchedFilters: string[];
}

/**
 * Extract keywords from transaction description
 */
export function extractKeywords(description: string): string[] {
  return description
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove special characters
    .split(/\s+/)
    .filter((word) => word.length > 2) // Filter out short words
    .filter(
      (word) =>
        ![
          "the",
          "and",
          "for",
          "with",
          "from",
          "to",
          "of",
          "in",
          "at",
          "on",
        ].includes(word)
    ); // Remove common words
}

/**
 * Calculate similarity between two strings
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Check if transaction matches category filters
 */
export function matchesCategoryFilters(
  transaction: BunqTransactionResponse,
  filters: CategoryFilter
): { matches: boolean; confidence: number; matchedFilters: string[] } {
  const description = transaction.description.toLowerCase();
  const amount = parseFloat(transaction.amount) || 0;
  const matchedFilters: string[] = [];
  let totalConfidence = 0;
  let matchCount = 0;

  // Check keyword matches
  if (filters.keywords.length > 0) {
    const transactionKeywords = extractKeywords(transaction.description);
    let keywordMatches = 0;

    for (const keyword of filters.keywords) {
      const keywordLower = keyword.toLowerCase();

      // Direct match
      if (description.includes(keywordLower)) {
        keywordMatches++;
        matchedFilters.push(`keyword: ${keyword}`);
      } else {
        // Fuzzy match
        for (const txKeyword of transactionKeywords) {
          const similarity = calculateSimilarity(keywordLower, txKeyword);
          if (similarity > 0.7) {
            keywordMatches++;
            matchedFilters.push(`keyword: ${keyword} (fuzzy: ${txKeyword})`);
            break;
          }
        }
      }
    }

    if (keywordMatches > 0) {
      totalConfidence += (keywordMatches / filters.keywords.length) * 0.6;
      matchCount++;
    }
  }

  // Check merchant pattern matches
  if (filters.merchantPatterns.length > 0) {
    let merchantMatches = 0;

    for (const pattern of filters.merchantPatterns) {
      const patternLower = pattern.toLowerCase();
      if (description.includes(patternLower)) {
        merchantMatches++;
        matchedFilters.push(`merchant: ${pattern}`);
      }
    }

    if (merchantMatches > 0) {
      totalConfidence +=
        (merchantMatches / filters.merchantPatterns.length) * 0.8;
      matchCount++;
    }
  }

  // Check amount range matches
  if (filters.amountRanges.length > 0) {
    let amountMatches = 0;

    for (const range of filters.amountRanges) {
      const inRange =
        (!range.min || amount >= range.min) &&
        (!range.max || amount <= range.max);
      if (inRange) {
        amountMatches++;
        matchedFilters.push(
          `amount: ${range.min || "any"} - ${range.max || "any"}`
        );
      }
    }

    if (amountMatches > 0) {
      totalConfidence += (amountMatches / filters.amountRanges.length) * 0.4;
      matchCount++;
    }
  }

  // Check exclude keywords (reduce confidence if found)
  if (filters.excludeKeywords.length > 0) {
    for (const excludeKeyword of filters.excludeKeywords) {
      if (description.includes(excludeKeyword.toLowerCase())) {
        totalConfidence *= 0.3; // Significantly reduce confidence
        matchedFilters.push(`excluded: ${excludeKeyword}`);
      }
    }
  }

  const finalConfidence = matchCount > 0 ? totalConfidence / matchCount : 0;
  return {
    matches: finalConfidence > 0.3,
    confidence: finalConfidence,
    matchedFilters,
  };
}

/**
 * Find matching categories for a transaction
 */
export function findMatchingCategories(
  transaction: BunqTransactionResponse,
  categories: BudgetCategory[]
): CategorizationMatch[] {
  const matches: CategorizationMatch[] = [];

  for (const category of categories) {
    if (!category.autoCategorizeFilters) continue;

    try {
      const filters: CategoryFilter = JSON.parse(
        category.autoCategorizeFilters
      );
      const result = matchesCategoryFilters(transaction, filters);

      if (result.matches) {
        matches.push({
          categoryId: category.id,
          categoryName: category.name,
          confidence: result.confidence,
          matchedFilters: result.matchedFilters,
        });
      }
    } catch (error) {
      console.error(
        `Error parsing filters for category ${category.name}:`,
        error
      );
    }
  }

  // Sort by confidence (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Generate auto-categorization filters based on existing categorizations
 */
export function generateFiltersFromTransactions(
  transactions: BunqTransactionResponse[]
): CategoryFilter {
  const categoryTransactions = transactions;

  if (categoryTransactions.length === 0) {
    return {
      keywords: [],
      merchantPatterns: [],
      amountRanges: [],
      excludeKeywords: [],
    };
  }

  // Extract common keywords
  const allKeywords = categoryTransactions.flatMap((tx) =>
    extractKeywords(tx.description)
  );
  const keywordCounts = allKeywords.reduce((acc, keyword) => {
    acc[keyword] = (acc[keyword] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const commonKeywords = Object.entries(keywordCounts)
    .filter(([, count]) => count > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([keyword]) => keyword);

  // Extract merchant patterns (common prefixes/suffixes)
  const merchantPatterns = categoryTransactions
    .map((tx) => tx.description.split(" ")[0]) // First word
    .filter((merchant) => merchant.length > 3)
    .reduce((acc, merchant) => {
      acc[merchant] = (acc[merchant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const commonMerchants = Object.entries(merchantPatterns)
    .filter(([, count]) => count > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([merchant]) => merchant);

  // Calculate amount ranges
  const amounts = categoryTransactions.map((tx) =>
    Math.abs(parseFloat(tx.amount) || 0)
  );
  const minAmount = Math.min(...amounts);
  const maxAmount = Math.max(...amounts);

  return {
    keywords: commonKeywords,
    merchantPatterns: commonMerchants,
    amountRanges: [
      {
        min: minAmount * 0.5,
        max: maxAmount * 1.5,
      },
    ],
    excludeKeywords: [],
  };
}
