<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1>Products</h1>
        <p>Discover our wide range of products</p>
      </div>

      <!-- TODO: Implement filters and search -->
      <div class="products-controls">
        <div class="search-section">
          <div class="search-placeholder">
            <h3>🔍 Search Functionality Missing</h3>
            <p>Implement search input with the following features:</p>
            <ul>
              <li>Search by product title</li>
              <li>Real-time search with debouncing</li>
              <li>Search suggestions</li>
              <li>Clear search functionality</li>
            </ul>
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
      </div>

      <div class="products-content">
        <div class="container">
          <div v-if="initialLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Loading products...</p>
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
              <p>You've reached the end of our product catalog!</p>
              <p>Found {{ products.length }} products in total.</p>
            </div>

            <div v-else-if="products.length === 0" class="no-products">
              <p>No products found.</p>
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

const { getAllProducts, getCategories } = useProducts();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const initialLoading = ref(false);
const loadingMore = ref(false);
const error = ref<string | null>(null);
const noMoreProducts = ref(false);
const currentPage = ref(0);
const itemsPerPage = 20;

const productsContainer = useTemplateRef<HTMLElement>("productsContainer");

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
  if (loadingMore.value || noMoreProducts.value || initialLoading.value) return;

  try {
    loadingMore.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const skip = currentPage.value * itemsPerPage;
    const getMoreProducts = await getAllProducts({
      limit: itemsPerPage,
      skip,
    });

    if (getMoreProducts.products.length > 0) {
      products.value.push(...getMoreProducts.products);
      currentPage.value++;
    }

    if (getMoreProducts.products.length < itemsPerPage) {
      noMoreProducts.value = true;
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loadingMore.value = false;
  }
};

useInfiniteScroll(productsContainer, loadMoreProducts, {
  distance: 100,
  direction: "bottom",
  canLoadMore: () =>
    !noMoreProducts.value && !initialLoading.value && !loadingMore.value,
});

onMounted(async () => {
  await loadInitialProducts();
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

.products-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.search-placeholder,
.filters-placeholder {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.search-placeholder h3,
.filters-placeholder h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.search-placeholder p,
.filters-placeholder p {
  color: #92400e;
  margin-bottom: 1rem;
}

.search-placeholder ul,
.filters-placeholder ul {
  color: #92400e;
  margin-left: 1.5rem;
}

.search-placeholder li,
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

/* Spinners */
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

/* End States */
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

/* Error States */
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

/* Responsive Design */
@media (max-width: 768px) {
  .products-controls {
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
