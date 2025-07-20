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
          @update:minPrice="filterState.minPrice = $event"
          @update:maxPrice="filterState.maxPrice = $event"
          @update:selectedBrands="filterState.selectedBrands = $event"
          @change="handleFilterChange"
        />
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
const filterState = ref({
  selectedCategory: "",
  minPrice: 0,
  maxPrice: 500,
  selectedBrands: [] as string[],
});
const brands = ref<string[]>([
  "Apple",
  "Glamour Beauty",
  "Nike",
  "Dell",
  "Essence",
]);

const productsContainer = useTemplateRef<HTMLElement>("productsContainer");

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
  await navigateTo({
    query: {
      ...route.query,
      category: filterState.value.selectedCategory || undefined,
      minPrice: filterState.value.minPrice,
      maxPrice: filterState.value.maxPrice,
      brands: filterState.value.selectedBrands.length
        ? filterState.value.selectedBrands.join(",")
        : undefined,
    },
  });

  products.value = [];
  error.value = null;
  initialLoading.value = true;
  currentPage.value = 0;
  noMoreProducts.value = false;

  let productsResponse;
  if (filterState.value.selectedCategory) {
    productsResponse = await getProductsByCategory(
      filterState.value.selectedCategory,
      {
        limit: itemsPerPage,
        skip: 0,
      }
    );
  } else {
    productsResponse = await getAllProducts({
      limit: itemsPerPage,
      skip: 0,
    });
  }

  let filteredProducts = productsResponse.products;

  if (filterState.value.minPrice > 0 || filterState.value.maxPrice < 500) {
    filteredProducts = productsResponse.products.filter((product) => {
      const price = product.price;
      return (
        price >= filterState.value.minPrice &&
        price <= filterState.value.maxPrice
      );
    });
  }

  if (filterState.value.selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filterState.value.selectedBrands.includes(product.brand)
    );
  }

  products.value = filteredProducts;
  if (filteredProducts.length < itemsPerPage) {
    noMoreProducts.value = true;
  }
  currentPage.value = 1;
  initialLoading.value = false;
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    await loadInitialProducts();
    return;
  }

  try {
    searchLoading.value = true;
    error.value = null;
    currentPage.value = 0;
    noMoreProducts.value = false;

    const searchResponse = await searchProducts(searchQuery.value.trim(), {
      limit: itemsPerPage,
      skip: 0,
    });

    products.value = searchResponse.products;

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
    categories.value = categoriesData.map((category: any) => category.name);

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

useInfiniteScroll(window, loadMoreProducts, {
  distance: 100,
  direction: "bottom",
  canLoadMore: () =>
    !noMoreProducts.value &&
    !initialLoading.value &&
    !loadingMore.value &&
    !searchLoading.value,
});

onMounted(async () => {
  if (searchQuery.value) {
    await performSearch();
  } else {
    await loadInitialProducts();
  }
});

onMounted(() => {
  if (process.client) {
    const savedViewMode = localStorage.getItem("viewMode");
    if (savedViewMode === "grid" || savedViewMode === "list") {
      viewMode.value = savedViewMode;
    }
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
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
  background: var(--primary-color, #3b82f6);
  border-color: var(--primary-color, #3b82f6);
  color: white;
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
}

.filters-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
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
