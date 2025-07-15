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

      <!-- TODO: Implement product grid with pagination -->
      <div class="products-content">
        <div class="container">
          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
          </div>

          <div v-else-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <div v-else class="products-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO: Implement the following functionality:
// 1. Fetch products from API using useProducts() composable
// 2. Implement search functionality with debouncing
// 3. Add category, price, brand, and rating filters
// 4. Implement pagination or infinite scroll
// 5. Add grid/list view toggle
// 6. Handle loading and error states
// 7. Make it responsive for mobile devices

import type { Product } from "~/types";

const { getAllProducts, getCategories } = useProducts();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    const [productsResponse, categoriesData] = await Promise.all([
      getAllProducts({ limit: 20 }),
      getCategories(),
    ]);
    products.value = productsResponse.products;
    categories.value = categoriesData;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
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
}

.products-grid-placeholder {
  background-color: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
}

.products-grid-placeholder h3 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.products-grid-placeholder p {
  color: #1e40af;
  margin-bottom: 1rem;
}

.products-grid-placeholder ul {
  color: #1e40af;
  margin-left: 1.5rem;
  text-align: left;
}

.products-grid-placeholder li {
  margin-bottom: 0.5rem;
}

.implementation-hints {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #93c5fd;
  text-align: left;
}

.implementation-hints h4 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.implementation-hints code {
  background-color: #f1f5f9;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #475569;
}

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
}
</style>
