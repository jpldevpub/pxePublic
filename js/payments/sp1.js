// Create a Stripe client.
// eslint-disable-next-line no-undef
const stripe = Stripe('pk_test_mqvvrRfh33w5nq2qXbI0SPOu')
const elements = stripe.elements()

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}

// Create an instance of the card Element.
const card = elements.create('card', { style })

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element')

// Handle real-time validation errors from the card Element.
card.addEventListener('change', ({ error }) => {
  const displayError = document.getElementById('card-errors')
  if (error) {
    displayError.textContent = error.message
  } else {
    displayError.textContent = ''
  }
})

// Create a token or display an error when the form is submitted.
const form = document.getElementById('payment-form')
form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const { token, error } = await stripe.createToken(card)
  if (error) {
    // Inform the customer that there was an error.
    const errorElement = document.getElementById('card-errors')
    errorElement.textContent = error.message
  } else {
    // Send the token to your server.
    stripeTokenHandler(token)
  }
})

const stripeTokenHandler = (token) => {
  // Insert the token ID into the form so it gets submitted to the server
  const form = document.getElementById('payment-form')
  const hiddenInput = document.createElement('input')
  hiddenInput.setAttribute('type', 'hidden')
  hiddenInput.setAttribute('name', 'stripeToken')
  hiddenInput.setAttribute('value', token.id)
  form.appendChild(hiddenInput)

  // Submit the form
  form.submit()
}
