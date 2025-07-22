<template>
  <div class="filter-container">
    <h3 class="filter-header" @click="toggleMobileFilters">
      Filters
      <span class="mobile-toggle" :class="{ expanded: showMobileFilters }"
        >↓</span
      >
    </h3>
    <div
      class="filter-content"
      :class="{ 'mobile-hidden': !showMobileFilters }"
    >
      <div class="filter-row">
        <div class="category-filter">
          <label for="category-select">Category:</label>
          <select
            id="category-select"
            class="category-dropdown"
            :value="modelValue"
            @change="
              if ($event.target)
                $emit(
                  'update:modelValue',
                  ($event.target as HTMLSelectElement).value
                );
              $emit('change');
            "
            :disabled="disabled"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="price-range">
          <label for="price-range">Price:</label>
          <div class="price-inputs">
            <input
              id="price-range"
              type="number"
              :value="minPrice"
              @input="
                if ($event.target) {
                  $emit(
                    'update:minPrice',
                    Number(($event.target as HTMLInputElement).value)
                  );
                }
                $emit('change');
              "
              :disabled="disabled"
              placeholder="Min"
            />
            <span>–</span>
            <input
              id="price-range-max"
              type="number"
              :value="maxPrice"
              @input="
                if ($event.target) {
                  $emit(
                    'update:maxPrice',
                    Number(($event.target as HTMLInputElement).value)
                  );
                }
                $emit('change');
              "
              :disabled="disabled"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      <div class="filter-row">
        <div class="brand-filter">
          <label>Brands:</label>
          <div class="brand-checkboxes">
            <label v-for="brand in brands" :key="brand" class="brand-checkbox">
              <input
                type="checkbox"
                :value="brand"
                :checked="selectedBrands.includes(brand)"
                @change="
                  $emit(
                    'update:selectedBrands',
                    ($event.target as HTMLInputElement).checked
                      ? [...selectedBrands, brand]
                      : selectedBrands.filter((b) => b !== brand)
                  );
                  $emit('change');
                "
                :disabled="disabled"
              />
              {{ brand }}
            </label>
          </div>
        </div>
      </div>

      <div class="filter-row">
        <div class="rating-filter">
          <label for="rating-select">Rating:</label>
          <select
            id="rating-select"
            class="rating-dropdown"
            :value="minRating"
            @change="
              if ($event.target) {
                $emit(
                  'update:minRating',
                  Number(($event.target as HTMLSelectElement).value)
                );
              }
              $emit('change');
            "
            :disabled="disabled"
          >
            <option value="0">All Ratings</option>
            <option value="5">5 ⭐ & up</option>
            <option value="4">4 ⭐ & up</option>
            <option value="3">3 ⭐ & up</option>
            <option value="2">2 ⭐ & up</option>
            <option value="1">1 ⭐ & up</option>
          </select>
        </div>
      </div>

      <div class="sort-row">
        <div class="sort">
          <label for="sort-by">Sort by:</label>
          <select
            id="sort-by"
            class="sort-dropdown"
            :value="sortBy"
            @change="
              if ($event.target) {
                $emit(
                  'update:sortBy',
                  ($event.target as HTMLSelectElement).value
                );
              }
              $emit('change');
            "
            :disabled="disabled"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="title-asc">Name: A to Z</option>
          </select>
        </div>
        <div class="clear-filter">
          <button
            type="button"
            class="clear-button"
            @click="clearFilters"
            :disabled="disabled"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  categories: string[];
  modelValue: string;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  selectedBrands: string[];
  minRating: number;
  sortBy?: string;
  disabled?: boolean;
}>();

const emit = defineEmits([
  "update:modelValue",
  "update:minPrice",
  "update:maxPrice",
  "update:selectedBrands",
  "update:minRating",
  "update:sortBy",
  "change",
  "clear",
]);

const showMobileFilters = ref(false);

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
};

const clearFilters = () => {
  emit("update:modelValue", "");
  emit("update:minPrice", 0);
  emit("update:maxPrice", 500);
  emit("update:selectedBrands", []);
  emit("update:minRating", 0);
  emit("update:sortBy", "");
  emit("clear");
  emit("change");
};
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-header {
  margin: 0;
  cursor: pointer;
  user-select: none;
  display: none;
  justify-content: space-between;
  align-items: center;
}

.mobile-toggle {
  transition: transform 0.2s ease;
  font-size: 0.8em;
}

.mobile-toggle.expanded {
  transform: rotate(180deg);
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.sort-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-filter {
  display: flex;
  align-items: center;
}

.category-dropdown {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 0.375rem);
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  font-size: 1rem;
}

.price-range {
  display: flex;
  align-items: center;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.price-inputs input {
  width: 70px;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius, 0.375rem);
  border: 1px solid #d1d5db;
  font-size: 1rem;
}

.rating-filter {
  display: flex;
  align-items: center;
}

.rating-dropdown {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 0.375rem);
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.sort {
  display: flex;
  align-items: center;
}

.sort-dropdown {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 0.375rem);
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  font-size: 1rem;
}

.brand-filter {
  display: flex;
  align-items: center;
}

.brand-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.brand-checkbox {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.clear-button {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 0.375rem);
  border: none;
  background: var(--secondary-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clear-button:hover:not(:disabled) {
  background: var(--text-color);
}

.clear-button:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filter-header {
    display: flex;
    cursor: pointer;
  }

  .filter-content.mobile-hidden {
    display: none;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .sort-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .sort {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
