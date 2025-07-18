<template>
  <div class="filter-container">
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
      <label for="price-range">Price Range:</label>
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
          id="price-range"
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
</template>

<script setup lang="ts">
defineProps<{
  categories: string[];
  modelValue: string;
  minPrice: number;
  maxPrice: number;
  disabled?: boolean;
}>();
defineEmits([
  "update:modelValue",
  "update:minPrice",
  "update:maxPrice",
  "change",
]);
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
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

@media (max-width: 768px) {
  .filter-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
