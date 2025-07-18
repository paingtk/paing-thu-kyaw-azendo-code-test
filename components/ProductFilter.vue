<template>
  <div>
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
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: string[];
  modelValue: string;
  disabled?: boolean;
}>();
defineEmits(["update:modelValue", "change"]);
</script>

<style scoped>
.category-dropdown {
  margin: 1rem 0 0 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 0.375rem);
  border: 1px solid #d1d5db;
  background: white;
  color: #6b7280;
  font-size: 1rem;
}
</style>
