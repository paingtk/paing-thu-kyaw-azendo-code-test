<template>
  <div class="checkout-page">
    <div class="container">
      <div class="checkout-header">
        <h1>Checkout</h1>
        <div class="checkout-steps">
          <div class="step" :class="{ active: step >= 1 }">
            <span class="step-number">1</span>
            <span class="step-label">Shipping</span>
          </div>
          <div class="step" :class="{ active: step >= 2 }">
            <span class="step-number">2</span>
            <span class="step-label">Payment</span>
          </div>
          <div class="step" :class="{ active: step >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">Review</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-form">
          <!-- Step 1: Shipping Information -->
          <div v-if="step === 1" class="checkout-step">
            <h2>Shipping Information</h2>

            <form @submit.prevent="nextStep">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    id="firstName"
                    v-model="shippingForm.firstName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    id="lastName"
                    v-model="shippingForm.lastName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="address" class="form-label">Street Address</label>
                <input
                  id="address"
                  v-model="shippingForm.address"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city" class="form-label">City</label>
                  <input
                    id="city"
                    v-model="shippingForm.city"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="state" class="form-label">State</label>
                  <input
                    id="state"
                    v-model="shippingForm.state"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="zipCode" class="form-label">ZIP Code</label>
                  <input
                    id="zipCode"
                    v-model="shippingForm.zipCode"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Information -->
          <div v-else-if="step === 2" class="checkout-step">
            <h2>Payment Information</h2>
            <form @submit.prevent="nextStep">
              <div class="payment-methods">
                <h3>Choose your payment methods</h3>

                <div class="form-row">
                  <label
                    class="payment-option"
                    :class="{ active: paymentForm.method === 'card' }"
                  >
                    <input
                      type="radio"
                      v-model="paymentForm.method"
                      value="card"
                      class="payment-radio"
                    />
                    <div class="payment-option-content">
                      <div class="payment-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="50"
                          height="50"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#1565C0"
                            d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"
                          ></path>
                          <path
                            fill="#FFF"
                            d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"
                          ></path>
                          <path
                            fill="#FFC107"
                            d="M12.212,24.945l-0.966-4.748c0,0-0.437-1.029-1.573-1.029c-1.136,0-4.44,0-4.44,0S10.894,20.84,12.212,24.945z"
                          ></path>
                        </svg>
                      </div>
                      <div class="payment-details">
                        <span class="payment-name">Credit / Debit Card</span>
                      </div>
                    </div>
                  </label>

                  <label
                    class="payment-option"
                    :class="{ active: paymentForm.method === 'paypal' }"
                  >
                    <input
                      type="radio"
                      v-model="paymentForm.method"
                      value="paypal"
                      class="payment-radio"
                    />
                    <div class="payment-option-content">
                      <div class="payment-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="50"
                          height="50"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#1565C0"
                            d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"
                          ></path>
                          <path
                            fill="#039BE5"
                            d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"
                          ></path>
                          <path
                            fill="#283593"
                            d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"
                          ></path>
                        </svg>
                      </div>
                      <div class="payment-details">
                        <span class="payment-name">PayPal</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div v-if="paymentForm.method === 'card'" class="card-form">
                <h4>Card Details</h4>

                <div class="form-group">
                  <label for="cardNumber" class="form-label">Card Number</label>
                  <div class="input-with-icon">
                    <input
                      id="cardNumber"
                      v-model="paymentForm.cardNumber"
                      type="text"
                      class="form-input"
                      :class="{ error: cardErrors.cardNumber }"
                      placeholder="2121 2121 2121 2121"
                      maxlength="19"
                      @input="
                        paymentForm.cardNumber = formatCreditCard(
                          paymentForm.cardNumber
                        )
                      "
                      @blur="validateCardNumber"
                      required
                    />
                    <div class="card-icon">
                      {{ getCardType(paymentForm.cardNumber) }}
                    </div>
                  </div>
                  <span v-if="cardErrors.cardNumber" class="error-message">{{
                    cardErrors.cardNumber
                  }}</span>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="expiryDate" class="form-label"
                      >Expiry Date</label
                    >
                    <input
                      id="expiryDate"
                      v-model="paymentForm.expiryDate"
                      type="text"
                      class="form-input"
                      :class="{ error: cardErrors.expiryDate }"
                      placeholder="MM/YY"
                      maxlength="5"
                      @input="
                        paymentForm.expiryDate = formatExpiryDate(
                          paymentForm.expiryDate
                        )
                      "
                      @blur="validateExpiryDate"
                      required
                    />
                    <span v-if="cardErrors.expiryDate" class="error-message">{{
                      cardErrors.expiryDate
                    }}</span>
                  </div>
                  <div class="form-group">
                    <label for="cvv" class="form-label">CVV</label>
                    <input
                      id="cvv"
                      v-model="paymentForm.cvv"
                      type="text"
                      class="form-input"
                      :class="{ error: cardErrors.cvv }"
                      placeholder="123"
                      maxlength="3"
                      @input="paymentForm.cvv = formatCVV(paymentForm.cvv)"
                      @blur="validateCVV"
                      required
                    />
                    <span v-if="cardErrors.cvv" class="error-message">{{
                      cardErrors.cvv
                    }}</span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="cardholderName" class="form-label"
                    >Cardholder Name</label
                  >
                  <input
                    id="cardholderName"
                    v-model="paymentForm.cardholderName"
                    type="text"
                    class="form-input"
                    :class="{ error: cardErrors.cardholderName }"
                    placeholder="John Doe"
                    @blur="validateCardholderName"
                    required
                  />
                  <span
                    v-if="cardErrors.cardholderName"
                    class="error-message"
                    >{{ cardErrors.cardholderName }}</span
                  >
                </div>
              </div>

              <div
                v-if="paymentForm.method === 'paypal'"
                class="paypal-payment"
              >
                <h4>
                  You will be redirected to PayPal to continue with your
                  payment.
                </h4>
              </div>

              <div class="billing-address">
                <h4>Billing Address</h4>
                <input
                  type="checkbox"
                  name="billing-address"
                  id="billing-address"
                  v-model="paymentForm.sameAsShipping"
                  class="checkbox-input"
                />
                <label for="billing-address">Same as shipping address</label>
                <div v-if="!paymentForm.sameAsShipping" class="billing-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName" class="form-label"
                        >First Name</label
                      >
                      <input
                        id="firstName"
                        v-model="billingForm.firstName"
                        type="text"
                        class="form-input"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="lastName" class="form-label">Last Name</label>
                      <input
                        id="lastName"
                        v-model="billingForm.lastName"
                        type="text"
                        class="form-input"
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="address" class="form-label"
                      >Street Address</label
                    >
                    <input
                      id="address"
                      v-model="billingForm.address"
                      type="text"
                      class="form-input"
                      required
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="city" class="form-label">City</label>
                      <input
                        id="city"
                        v-model="billingForm.city"
                        type="text"
                        class="form-input"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="state" class="form-label">State</label>
                      <input
                        id="state"
                        v-model="billingForm.state"
                        type="text"
                        class="form-input"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="zipCode" class="form-label">ZIP Code</label>
                      <input
                        id="zipCode"
                        v-model="billingForm.zipCode"
                        type="text"
                        class="form-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button @click="step = 1" class="btn btn-outline">
                  Back to Shipping
                </button>
                <button type="submit" class="btn btn-primary">
                  Continue to Review
                </button>
              </div>
            </form>
          </div>

          <!-- Step 3: Order Review -->
          <div v-else-if="step === 3" class="checkout-step">
            <h2>Order Review</h2>

            <div class="incomplete-section">
              <div class="incomplete-message">
                <h3>🚧 Order Review Incomplete</h3>
                <p>This section needs to be implemented:</p>
                <ul>
                  <li>Order summary with all items</li>
                  <li>Shipping information review</li>
                  <li>Payment method summary</li>
                  <li>Terms and conditions checkbox</li>
                  <li>Place order functionality</li>
                </ul>
              </div>
            </div>

            <div class="form-actions">
              <button @click="step = 2" class="btn btn-outline">
                Back to Payment
              </button>
              <button class="btn btn-primary" disabled>Place Order</button>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>

            <div class="summary-items">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="summary-item"
              >
                <div class="item-info">
                  <img
                    :src="item.product.thumbnail"
                    :alt="item.product.title"
                    class="item-image"
                  />
                  <div class="item-details">
                    <h4>{{ item.product.title }}</h4>
                    <p>Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="item-price">
                  ${{ (item.product.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>

            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total-row">
                <span>Total:</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const cartStore = useCartStore();
import { useCard } from "../composables/useCard";
const { items: cartItems, subtotal } = storeToRefs(cartStore);

// Redirect if cart is empty
if (cartItems.value.length === 0) {
  await navigateTo("/cart");
}

const step = ref(1);

const shippingForm = reactive({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

const billingForm = reactive({
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

const paymentForm = reactive({
  method: "card",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardholderName: "",
  sameAsShipping: true,
  billingFirstName: "",
  billingLastName: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingZipCode: "",
});

const cardErrors = reactive({
  cardNumber: "",
  expiryDate: "",
  cvv: "",
  cardholderName: "",
});

const tax = computed(() => subtotal.value * 0.08); // 8% tax
const finalTotal = computed(() => subtotal.value + tax.value);

const { formatCreditCard, formatExpiryDate, formatCVV, getCardType } =
  useCard();

const validateCardNumber = () => {
  if (!paymentForm.cardNumber) {
    cardErrors.cardNumber = "Card number is required";
  } else if (paymentForm.cardNumber.length < 19) {
    cardErrors.cardNumber = "Card number must be at least 13 digits";
  } else {
    cardErrors.cardNumber = "";
  }
};

const validateCardholderName = () => {
  const name = paymentForm.cardholderName.trim();
  if (!name) {
    cardErrors.cardholderName = "Cardholder name is required";
    return false;
  }
  if (name.length < 2) {
    cardErrors.cardholderName = "Name must be at least 2 characters";
    return false;
  }
  cardErrors.cardholderName = "";
  return true;
};

const validateExpiryDate = () => {
  const expiry = paymentForm.expiryDate;
  if (!expiry) {
    cardErrors.expiryDate = "Expiry date is required";
    return false;
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    cardErrors.expiryDate = "Invalid format (MM/YY)";
    return false;
  }
  const [month, year] = expiry.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (parseInt(month) < 1 || parseInt(month) > 12) {
    cardErrors.expiryDate = "Invalid month";
    return false;
  }
  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    cardErrors.expiryDate = "Please put a valid date";
    return false;
  }
  cardErrors.expiryDate = "";
  return true;
};

const validateCVV = () => {
  const cvv = paymentForm.cvv;
  if (!cvv) {
    cardErrors.cvv = "CVV is required";
    return false;
  }
  if (!/^\d{3}$/.test(cvv)) {
    cardErrors.cvv = "CVV must be 3 digits";
    return false;
  }
  cardErrors.cvv = "";
  return true;
};

watch(
  () => paymentForm.cardNumber,
  (newValue) => {
    if (newValue !== paymentForm.cardNumber) {
      paymentForm.cardNumber = formatCreditCard(newValue);
    }
  }
);

const checkPaymentForm = computed(() => {
  if (paymentForm.method === "card") {
    const requiredCardFields = [
      paymentForm.cardNumber,
      paymentForm.expiryDate,
      paymentForm.cvv,
      paymentForm.cardholderName,
    ];

    const cardFieldsValid = requiredCardFields.every(
      (field) => field.trim() !== ""
    );

    if (!paymentForm.sameAsShipping) {
      const billingFields = [
        paymentForm.billingFirstName,
        paymentForm.billingLastName,
        paymentForm.billingAddress,
        paymentForm.billingCity,
        paymentForm.billingState,
        paymentForm.billingZipCode,
      ];
      return (
        cardFieldsValid && billingFields.every((field) => field.trim() !== "")
      );
    }

    return cardFieldsValid;
  }
  return false;
});

const nextStep = () => {
  if (step.value < 3) {
    if (step.value === 2 && !checkPaymentForm.value) {
      return;
    }
    step.value++;
  }
};
</script>

<style scoped>
.checkout-page {
  padding: 2rem 0;
  min-height: 80vh;
}

.checkout-header {
  text-align: center;
  margin-bottom: 3rem;
}

.checkout-header h1 {
  margin-bottom: 2rem;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--border-color);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
}

.step-label {
  font-weight: 500;
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.checkout-form {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.checkout-step h2 {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.incomplete-section {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
}

.incomplete-message h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.incomplete-message p {
  color: #92400e;
  margin-bottom: 1rem;
}

.incomplete-message ul {
  color: #92400e;
  margin-left: 1.5rem;
}

.incomplete-message li {
  margin-bottom: 0.5rem;
}

.order-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.summary-card h3 {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.item-details h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
}

.item-details p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  color: var(--primary-color);
}

.summary-totals {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total-row {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.form-input.error {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 1px var(--danger-color);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.75rem;
}

.payment-option {
  display: flex;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.payment-option.active {
  border-color: var(--primary-color);
}

.payment-option-content {
  margin-left: 1rem;
}

.card-form {
  margin: 2rem 0;
}

.input-with-icon {
  position: relative;
}

.card-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  pointer-events: none;
}

.paypal-payment {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.checkbox-input {
  margin-right: 0.25rem;
}

.billing-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .checkout-steps {
    flex-direction: column;
    align-items: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    justify-content: center;
  }
}
</style>
