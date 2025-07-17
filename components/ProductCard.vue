<template>
  <div
    class="product-card"
    :class="{ 'product-card--list': viewMode === 'list' }"
  >
    <NuxtLink :to="`/products/${product.id}`" class="product-link">
      <div class="product-image">
        <NuxtImg :src="product.thumbnail" :alt="product.title" loading="lazy" />
        <div v-if="product.discountPercentage > 0" class="discount-badge">
          -{{ Math.round(product.discountPercentage) }}%
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">{{ product.title }}</h3>
        <p class="product-brand">{{ product.brand }}</p>
        <div class="product-rating">
          <span class="stars">{{ getStars(product.rating) }}</span>
          <span class="rating-value">({{ product.rating }})</span>
        </div>
        <p v-if="viewMode === 'list'" class="product-description">
          {{ product.description }}
        </p>
        <div class="product-price">
          <span v-if="product.discountPercentage > 0" class="original-price">
            ${{ product.price.toFixed(2) }}
          </span>
          <span class="current-price"> ${{ discountedPrice.toFixed(2) }} </span>
        </div>
        <button @click="addToCart" class="btn btn-primary add-to-cart">
          Add to Cart
        </button>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

interface Props {
  product: Product;
  viewMode?: "grid" | "list";
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: "grid",
});

const cartStore = useCartStore();

const discountedPrice = computed(() => {
  const discount =
    (props.product.price * props.product.discountPercentage) / 100;
  return props.product.price - discount;
});

const getStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return "★".repeat(fullStars) + (halfStar ? "☆" : "") + "☆".repeat(emptyStars);
};

const addToCart = () => {
  cartStore.addToCart(props.product);
  // You could add a toast notification here
};
</script>

<style scoped>
.product-card {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.product-card--list {
  flex-direction: row;
  align-items: stretch;
}

.product-card--list:hover {
  transform: none;
}

.product-link {
  display: block;
  color: inherit;
  flex: 1;
}

.product-card--list .product-link {
  display: flex;
  align-items: stretch;
}

.product-image {
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  background-color: #f9fafb;
}

.product-card--list .product-image {
  width: 150px;
  min-width: 150px;
  padding-top: 0;
  height: auto;
  aspect-ratio: 1;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card--list .product-image img {
  position: static;
  width: 100%;
  height: 100%;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-card--list:hover .product-image img {
  transform: none;
}

.discount-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: var(--danger-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 600;
}

.product-info {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-card--list .product-info {
  position: relative;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.product-title {
  font-size: 1rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card--list .product-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.product-brand {
  color: var(--text-light);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.stars {
  color: #f59e0b;
  font-size: 0.875rem;
}

.rating-value {
  color: var(--text-light);
  font-size: 0.875rem;
}

.product-description {
  color: var(--text-light);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.product-card--list .product-price {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  margin-top: 0;
}

.original-price {
  color: var(--text-light);
  text-decoration: line-through;
  font-size: 0.875rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.add-to-cart {
  width: 100%;
  margin: 0;
  border-radius: 0;
  padding: 0.75rem;
}

.product-card--list .add-to-cart {
  width: auto;
  min-width: 120px;
  border-radius: var(--border-radius);
  margin: 1rem 0;
  align-self: flex-start;
}

@media (max-width: 768px) {
  .product-card--list {
    flex-direction: column;
  }

  .product-card--list .product-link {
    flex-direction: column;
  }

  .product-card--list .product-image {
    width: 100%;
    padding-top: 60%;
  }

  .product-card--list .product-image img {
    position: absolute;
  }

  .product-card--list .product-price {
    position: static;
    margin-top: auto;
  }

  .product-card--list .add-to-cart {
    width: 100%;
    margin: 0;
    border-radius: 0;
    align-self: stretch;
  }
}
</style>
