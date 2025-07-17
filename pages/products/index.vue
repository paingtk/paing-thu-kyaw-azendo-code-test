<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1>PRODUCT CATALOG PAGE</h1>
      </div>

      <div class="search-controls">
        <div class="search-section">
          <div class="search-container">
            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="search-input"
                @input="handleSearchInput"
                @keydown.enter="performSearch"
              />
              <div class="search-actions">
                <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="clear-button"
                  type="button"
                >
                  ✕
                </button>
                <button
                  @click="performSearch"
                  class="search-button"
                  type="button"
                >
                  🔍
                </button>
              </div>
            </div>

            <!-- Search Suggestions -->
            <div
              v-if="showSuggestions && searchSuggestions.length > 0"
              class="search-suggestions"
            >
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="selectSuggestion(suggestion)"
                class="suggestion-item"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="filters-placeholder">
          <h3>🎛️ Filters Missing</h3>
          <p>Implement the following filters:</p>
          <ul>
            <li>Category filter (dropdown)</li>
            <li>Price range filter (slider or inputs)</li>
            <li>Brand filter (checkbox list)</li>
            <li>Rating filter (star rating)</li>
            <li>Sort options (price, rating, popularity)</li>
          </ul>
        </div>
      </div>

      <div class="products-content">
        <div class="container">
          <div v-if="searchQuery" class="search-results-header">
            <p>
              {{
                searchLoading
                  ? "Searching..."
                  : `Found ${products.length} results for "${searchQuery}"`
              }}
            </p>
          </div>

          <div v-if="initialLoading || searchLoading" class="loading-container">
            <div class="spinner"></div>
            <p>
              {{
                searchQuery ? "Searching products..." : "Loading products..."
              }}
            </p>
          </div>

          <div v-else-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <div v-else>
            <div class="products-grid" ref="productsContainer">
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>

            <div v-if="loadingMore" class="loading-more">
              <div class="spinner-small"></div>
              <p>Loading more products...</p>
            </div>

            <div
              v-else-if="noMoreProducts && products.length > 0"
              class="end-message"
            >
              <p>
                You've reached the end
                {{
                  searchQuery
                    ? "of your search results"
                    : "of our product catalog"
                }}!
              </p>
              <p>Found {{ products.length }} products in total.</p>
            </div>

            <div v-else-if="products.length === 0" class="no-products">
              <p>
                {{
                  searchQuery
                    ? `No products found for "${searchQuery}".`
                    : "No products found."
                }}
              </p>
              <p v-if="searchQuery">
                Try different keywords or check your spelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";
import { useInfiniteScroll } from "@vueuse/core";

const { getAllProducts, getCategories, searchProducts } = useProducts();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const initialLoading = ref(false);
const loadingMore = ref(false);
const searchLoading = ref(false);
const error = ref<string | null>(null);
const noMoreProducts = ref(false);
const currentPage = ref(0);
const itemsPerPage = 20;
const searchQuery = ref("");
const searchSuggestions = ref<string[]>([]);
const showSuggestions = ref(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);
const recentSearches = ref<string[]>([]);

const productsContainer = useTemplateRef<HTMLElement>("productsContainer");

onMounted(() => {
  const stored = localStorage?.getItem("recentSearches");
  if (stored) {
    try {
      recentSearches.value = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse recent searches from localStorage", e);
      recentSearches.value = [];
    }
  }
});

const saveRecentSearch = (query: string) => {
  if (query && !recentSearches.value.includes(query)) {
    recentSearches.value.unshift(query);
    recentSearches.value = recentSearches.value.slice(0, 5);
    localStorage?.setItem(
      "recentSearches",
      JSON.stringify(recentSearches.value)
    );
  }
};

const generateSuggestions = async (query: string) => {
  if (!query || query.length < 2) {
    searchSuggestions.value = recentSearches.value;
    return;
  }

  const suggestions = [
    ...recentSearches.value.filter((search) =>
      search.toLowerCase().includes(query.toLowerCase())
    ),
    ...[
      "laptop",
      "smartphone",
      "headphones",
      "camera",
      "watch",
      "shoes",
      "clothing",
      "books",
      "electronics",
      "home",
    ].filter(
      (term) =>
        term.toLowerCase().includes(query.toLowerCase()) &&
        !recentSearches.value.includes(term)
    ),
  ];

  searchSuggestions.value = [...new Set(suggestions)].slice(0, 5);
};

const handleSearchInput = async () => {
  showSuggestions.value = true;

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  await generateSuggestions(searchQuery.value);

  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim()) {
      performSearch();
    } else {
      loadInitialProducts();
    }
  }, 300);
};

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  performSearch();
};

const clearSearch = () => {
  searchQuery.value = "";
  showSuggestions.value = false;
  loadInitialProducts();
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    loadInitialProducts();
    return;
  }

  try {
    searchLoading.value = true;
    error.value = null;
    currentPage.value = 0;
    noMoreProducts.value = false;
    showSuggestions.value = false;

    const searchResponse = await searchProducts(searchQuery.value.trim(), {
      limit: itemsPerPage,
      skip: 0,
    });

    products.value = searchResponse.products;
    saveRecentSearch(searchQuery.value.trim());

    if (searchResponse.products.length < itemsPerPage) {
      noMoreProducts.value = true;
    }

    currentPage.value = 1;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    searchLoading.value = false;
  }
};

const loadInitialProducts = async () => {
  try {
    initialLoading.value = true;
    error.value = null;
    currentPage.value = 0;
    noMoreProducts.value = false;

    const [productsResponse, categoriesData] = await Promise.all([
      getAllProducts({
        limit: itemsPerPage,
        skip: 0,
      }),
      getCategories(),
    ]);

    products.value = productsResponse.products;
    categories.value = categoriesData;

    if (productsResponse.products.length < itemsPerPage) {
      noMoreProducts.value = true;
    }

    currentPage.value = 1;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    initialLoading.value = false;
  }
};

const loadMoreProducts = async () => {
  if (
    loadingMore.value ||
    noMoreProducts.value ||
    initialLoading.value ||
    searchLoading.value
  )
    return;

  try {
    loadingMore.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const skip = currentPage.value * itemsPerPage;

    let moreProductsResponse;
    if (searchQuery.value.trim()) {
      moreProductsResponse = await searchProducts(searchQuery.value.trim(), {
        limit: itemsPerPage,
        skip,
      });
    } else {
      moreProductsResponse = await getAllProducts({
        limit: itemsPerPage,
        skip,
      });
    }

    if (moreProductsResponse.products.length > 0) {
      products.value.push(...moreProductsResponse.products);
      currentPage.value++;
    }

    if (moreProductsResponse.products.length < itemsPerPage) {
      noMoreProducts.value = true;
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loadingMore.value = false;
  }
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".search-container")) {
    showSuggestions.value = false;
  }
};

useInfiniteScroll(productsContainer, loadMoreProducts, {
  distance: 100,
  direction: "bottom",
  canLoadMore: () =>
    !noMoreProducts.value &&
    !initialLoading.value &&
    !loadingMore.value &&
    !searchLoading.value,
});

onMounted(async () => {
  await loadInitialProducts();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
}

.products-header {
  text-align: center;
  margin-bottom: 3rem;
}

.products-header h1 {
  margin-bottom: 0.5rem;
}

.products-header p {
  color: var(--text-light);
}

.search-controls {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.search-section,
.filters-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: var(--border-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.search-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-right: 0.75rem;
}

.clear-button,
.search-button {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s ease-in-out;
  font-size: 0.875rem;
}

.clear-button:hover {
  background-color: #f3f4f6;
  color: #dc2626;
}

.search-button:hover {
  background-color: #f3f4f6;
  color: #3b82f6;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  box-shadow: var(--shadow-sm);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.15s ease-in-out;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.search-results-header {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: var(--border-radius);
  border-left: 4px solid #3b82f6;
}

.search-results-header p {
  margin: 0;
  color: var(--text-dark);
  font-weight: 500;
}

.filters-placeholder {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.filters-placeholder h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.filters-placeholder p {
  color: #92400e;
  margin-bottom: 1rem;
}

.filters-placeholder ul {
  color: #92400e;
  margin-left: 1.5rem;
}

.filters-placeholder li {
  margin-bottom: 0.5rem;
}

.products-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 3rem;
  box-shadow: var(--shadow-sm);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-top: 2rem;
}

.loading-more p {
  margin-top: 1rem;
  color: var(--text-light);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.end-message {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #f8fafc;
  border-radius: var(--border-radius);
  margin-top: 2rem;
}

.end-message p {
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.end-message p:last-child {
  font-weight: 500;
  color: var(--text-dark);
}

.no-products {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-light);
}

.no-products p {
  margin-bottom: 0.5rem;
}

.alert {
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

@media (max-width: 768px) {
  .search-controls {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .products-content {
    padding: 2rem;
  }
}
</style>
