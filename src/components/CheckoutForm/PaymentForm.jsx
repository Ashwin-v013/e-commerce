import React from 'react'
import { Typography , Button , Divider } from '@material-ui/core';
import { Elements , CardElement , ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)

const PaymentForm =  ({checkoutToken , shippingData , backstep , onCaptureCheckout , nextstep , timeout , refreshCart}) => {


  //submit function 
  const Handlesubmit =async (event , elements , stripe) => {
 
    event.preventDefault();

    if(!elements || !stripe) return;

    //getting element 
    const cardelement = elements.getElement(CardElement);
   
    const { error , paymentMethod } = await stripe.createPaymentMethod({ type:'card' , card:cardelement })

    if(error) {
      console.log(error)
    } else {
      //creating Order data for all the info (ie) cart , customer 

      const  orderData = {
        line_items: checkoutToken.live.line_items,
        customer: { firstname: shippingData.firstName, lastname: shippingData.lastName, email: shippingData.email },
        shipping: { name: 'Primary', street: shippingData.address1, town_city: shippingData.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.zip, country: shippingData.shippingCountry },
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: 'stripe',
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        }, 

      }

      onCaptureCheckout(checkoutToken.id , orderData);
      refreshCart();
      timeout();
      nextstep()
    }

  }

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider/>
      <Typography variant='h6' gutterBottom style={{ margin:"20px 0" }}>Payment Method</Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({elements , stripe}) => (
            <form onSubmit={(e) => Handlesubmit(e , elements , stripe)}>
              <CardElement/>
              <br/><br/>
              <div style={{  display:'flex' , justifyContent: "space-between"  }}>
                <Button variant='outlined' onClick={backstep} >Back</Button>
                <Button variant='contained' type='submit' disabled={!stripe} color='primary' >
                  Pay { checkoutToken.live.subtotal.formatted_with_symbol }
                </Button>

              </div>
            </form>
          )}
        </ElementsConsumer>

      </Elements>
    </>
  )
}

export default PaymentForm