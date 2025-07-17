<template>
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
          <button @click="performSearch" class="search-button" type="button">
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
</template>

<script setup lang="ts">
interface SearchEmits {
  (event: "search", query: string): void;
  (event: "clear"): void;
  (event: "update:modelValue", value: string): void;
}

interface SearchProps {
  loading?: boolean;
  modelValue?: string;
}

const props = withDefaults(defineProps<SearchProps>(), {
  loading: false,
  modelValue: "",
});

const emit = defineEmits<SearchEmits>();

const searchQuery = ref(props.modelValue);
const searchSuggestions = ref<string[]>([]);
const showSuggestions = ref(false);
const searchTimeout = ref<NodeJS.Timeout | null>(null);
const recentSearches = ref<string[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue;
  }
);

watch(searchQuery, (newValue) => {
  emit("update:modelValue", newValue);
});

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
      emit("clear");
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
  emit("clear");
};

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    emit("clear");
    return;
  }

  showSuggestions.value = false;
  saveRecentSearch(searchQuery.value.trim());
  emit("search", searchQuery.value.trim());
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".search-container")) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
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
.search-section {
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
</style>
