<template>
  <div class="filter-container">
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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: string[];
  modelValue: string;
  minPrice: number;
  maxPrice: number;
  brands: string[];
  selectedBrands: string[];
  minRating: number;
  disabled?: boolean;
}>();
defineEmits([
  "update:modelValue",
  "update:minPrice",
  "update:maxPrice",
  "update:selectedBrands",
  "update:minRating",
  "change",
]);
</script>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 2rem;
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

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
