import { trackEvent } from './events';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initRazorpay(bundle) {
  const amounts = { single: 34900, triple: 89900, subscription: 29900 };
  const amount = amounts[bundle.type];

  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Are you offline?');
    return;
  }

  try {
    const result = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bundleType: bundle.type, amount, name: bundle.name })
    });
    const data = await result.json();

    if (!data.orderId) {
      throw new Error(data.error || 'Failed to create order');
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_dummy',
      amount: data.amount,
      currency: data.currency,
      name: 'Royal Swag',
      description: bundle.name,
      order_id: data.orderId,
      handler: function (response) {
        trackEvent('purchase', { value: amount / 100, bundle: bundle.type, orderId: response.razorpay_order_id });
        window.location.href = '/thank-you?order_id=' + response.razorpay_order_id;
      },
      prefill: {
        name: 'John Doe',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#495738'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error(error);
    alert('Could not initiate payment. Please try again.');
  }
}
