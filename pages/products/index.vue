<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h2>PRODUCT CATALOG PAGE</h2>
      </div>

      <div class="search-controls">
        <SearchBar
          v-model="searchQuery"
          :loading="searchLoading"
          @search="handleSearch"
          @clear="handleClearSearch"
        />
        <div class="view-controls">
          <div class="view-toggle">
            <button
              @click="viewMode = 'grid'"
              :class="{ active: viewMode === 'grid' }"
              class="view-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"
                />
              </svg>
              Grid
            </button>
            <button
              @click="viewMode = 'list'"
              :class="{ active: viewMode === 'list' }"
              class="view-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M3 5h2v2H3V5zm4 0h14v2H7V5zm-4 4h2v2H3V9zm4 0h14v2H7V9zm-4 4h2v2H3v-2zm4 0h14v2H7v-2zm-4 4h2v2H3v-2zm4 0h14v2H7v-2z"
                />
              </svg>
              List
            </button>
          </div>
        </div>
        <div class="filters-section">
          <ProductFilter
            v-model="filterState.selectedCategory"
            :categories="categories"
            :disabled="initialLoading"
            :minPrice="filterState.minPrice"
            :maxPrice="filterState.maxPrice"
            :brands="brands"
            :selectedBrands="filterState.selectedBrands"
            :minRating="filterState.minRating"
            @update:minPrice="filterState.minPrice = $event"
            @update:maxPrice="filterState.maxPrice = $event"
            @update:selectedBrands="filterState.selectedBrands = $event"
            @update:minRating="filterState.minRating = $event"
            @change="handleFilterChange"
          />
        </div>
      </div>

      <div class="products-content">
        <div class="container">
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
            <div
              class="products-container"
              :class="`products-container--${viewMode}`"
              ref="productsContainer"
            >
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                :view-mode="viewMode"
              />
            </div>

            <div v-if="loadingMore" class="loading-more">
              <div class="spinner-small"></div>
              <p>Loading more products...</p>
            </div>

            <button
              v-else-if="!noMoreProducts && products.length > 0"
              class="load-more-btn"
              @click="loadMoreProducts"
              :disabled="loadingMore"
            >
              Load More Products
            </button>

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
        <button
          v-show="showScrollTop"
          class="scroll-top-btn"
          @click="scrollToTop"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";
// import { useInfiniteScroll } from "@vueuse/core";
import SearchBar from "~/components/SearchBar.vue";
import ProductFilter from "~/components/ProductFilter.vue";

const { getAllProducts, getCategories, searchProducts, getProductsByCategory } =
  useProducts();
const route = useRoute();

const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const initialLoading = ref(false);
const loadingMore = ref(false);
const searchLoading = ref(false);
const error = ref<string | null>(null);
const noMoreProducts = ref(false);
const currentPage = ref(0);
const itemsPerPage = 20;
const searchQuery = ref((route.query.q as string) || "");
const viewMode = ref<"grid" | "list">("grid");
const showScrollTop = ref(false);
const filterState = ref({
  selectedCategory: "",
  minPrice: 0,
  maxPrice: 500,
  selectedBrands: [] as string[],
  minRating: 0,
});
const brands = ref<string[]>([
  "Gucci",
  "Glamour Beauty",
  "Dior",
  "Knoll",
  "Bath Trends",
]);

const productsContainer = useTemplateRef<HTMLElement>("productsContainer");

const applyFilters = (productList: Product[]): Product[] => {
  let filtered = productList;

  if (filterState.value.minPrice > 0 || filterState.value.maxPrice < 500) {
    filtered = filtered.filter((product) => {
      const price = product.price;
      return (
        price >= filterState.value.minPrice &&
        price <= filterState.value.maxPrice
      );
    });
  }

  if (filterState.value.selectedBrands.length > 0) {
    filtered = filtered.filter((product) =>
      filterState.value.selectedBrands.includes(product.brand)
    );
  }

  if (filterState.value.minRating > 0) {
    filtered = filtered.filter(
      (product) => product.rating >= filterState.value.minRating
    );
  }

  return filtered;
};

const resetPagination = () => {
  products.value = [];
  error.value = null;
  currentPage.value = 0;
  noMoreProducts.value = false;
};

const updateNoMoreProducts = (filteredProducts: Product[]) => {
  if (filteredProducts.length < itemsPerPage) {
    noMoreProducts.value = true;
  }
};

const initializeFromQuery = () => {
  const query = route.query;

  if (query.category)
    filterState.value.selectedCategory = query.category as string;
  if (query.minPrice) filterState.value.minPrice = Number(query.minPrice);
  if (query.maxPrice) filterState.value.maxPrice = Number(query.maxPrice);
  if (query.brands)
    filterState.value.selectedBrands = (query.brands as string).split(",");
  if (query.minRating) filterState.value.minRating = Number(query.minRating);
};

const buildQueryParams = () => ({
  ...route.query,
  category: filterState.value.selectedCategory || undefined,
  minPrice: filterState.value.minPrice || undefined,
  maxPrice:
    filterState.value.maxPrice !== 500 ? filterState.value.maxPrice : undefined,
  brands: filterState.value.selectedBrands.length
    ? filterState.value.selectedBrands.join(",")
    : undefined,
  minRating: filterState.value.minRating || undefined,
});

const fetchProducts = async (skip = 0) => {
  if (filterState.value.selectedCategory) {
    return await getProductsByCategory(filterState.value.selectedCategory, {
      limit: itemsPerPage,
      skip,
    });
  } else {
    return await getAllProducts({
      limit: itemsPerPage,
      skip,
    });
  }
};

const handleSearch = async (query: string) => {
  searchQuery.value = query;
  await navigateTo({
    query: { ...route.query, q: query },
  });
  await performSearch();
};

const handleClearSearch = async () => {
  searchQuery.value = "";
  const newQuery = { ...route.query };
  delete newQuery.q;
  await navigateTo({ query: newQuery });
  await loadInitialProducts();
};

const handleFilterChange = async () => {
  await navigateTo({ query: buildQueryParams() });

  resetPagination();
  initialLoading.value = true;

  try {
    const productsResponse = await fetchProducts(0);
    const filteredProducts = applyFilters(productsResponse.products);

    products.value = filteredProducts;
    updateNoMoreProducts(filteredProducts);
    currentPage.value = 1;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    initialLoading.value = false;
  }
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadInitialProducts();
    return;
  }

  try {
    searchLoading.value = true;
    resetPagination();

    const searchResponse = await searchProducts(searchQuery.value.trim(), {
      limit: itemsPerPage,
      skip: 0,
    });

    const filteredProducts = applyFilters(searchResponse.products);
    products.value = filteredProducts;
    updateNoMoreProducts(filteredProducts);
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
    resetPagination();

    const [productsResponse, categoriesData] = await Promise.all([
      fetchProducts(0),
      getCategories(),
    ]);

    const filteredProducts = applyFilters(productsResponse.products);
    products.value = filteredProducts;
    categories.value = categoriesData.map((category: any) => category.name);
    updateNoMoreProducts(filteredProducts);
    currentPage.value = 1;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    initialLoading.value = false;
  }
};

const loadMoreProducts = async () => {
  const noProducts =
    loadingMore.value ||
    noMoreProducts.value ||
    initialLoading.value ||
    searchLoading.value;
  if (noProducts) return;

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
      moreProductsResponse = await fetchProducts(skip);
    }

    const filteredProducts = applyFilters(moreProductsResponse.products);

    if (filteredProducts.length > 0) {
      products.value.push(...filteredProducts);
      currentPage.value++;
    }

    updateNoMoreProducts(filteredProducts);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loadingMore.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  window.addEventListener("scroll", () => {
    showScrollTop.value = window.scrollY > 300;
  });
});

watch(
  () => route.query.q,
  async (newQuery) => {
    const queryString = (newQuery as string) || "";
    if (queryString !== searchQuery.value) {
      searchQuery.value = queryString;
      if (queryString) {
        await performSearch();
      } else {
        await loadInitialProducts();
      }
    }
  }
);

watch(viewMode, (newMode) => {
  if (import.meta.client) {
    localStorage.setItem("viewMode", newMode);
  }
});

// useInfiniteScroll(window, loadMoreProducts, {
//   distance: 100,
//   direction: "bottom",
//   canLoadMore: () =>
//     !noMoreProducts.value &&
//     !initialLoading.value &&
//     !loadingMore.value &&
//     !searchLoading.value,
// });

onMounted(async () => {
  initializeFromQuery();

  if (import.meta.client) {
    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode === "grid" || savedViewMode === "list") {
      viewMode.value = savedViewMode;
    }
  }

  if (searchQuery.value) {
    await performSearch();
  } else {
    await loadInitialProducts();
  }
});
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.view-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: var(--border-radius, 0.375rem);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.view-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.view-btn.active:hover {
  background-color: #1d4ed8;
}

.products-container {
  display: grid;
  gap: 1.5rem;
}

.products-container--grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.products-container--list {
  grid-template-columns: 1fr;
  gap: 1rem;
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
  background-color: white;
}

.filters-section {
  grid-column: 1 / -1;
  padding: 1rem 2rem;
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
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--border-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top: 2px solid var(--border-color);
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
  background-color: var(--light-color);
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
  color: var(--danger-color);
}

.load-more-btn {
  display: flex;
  margin: 2rem auto 0 auto;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background: transparent;
  color: var(--text-light);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius, 0.375rem);
  cursor: pointer;
  transition: background 0.2s;
}

.load-more-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.load-more-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  opacity: 0.85;
  transition: opacity 0.2s;
}

.scroll-top-btn:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .search-controls {
    grid-template-columns: 1fr;
    gap: 1rem;
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

  .view-controls {
    justify-content: flex-start;
  }
}
</style>
