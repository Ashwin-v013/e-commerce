import React from 'react'
import { Link } from 'react-router-dom'
import { Container , Typography , Grid , Button } from '@material-ui/core'
import Cartitems from './Cartitem/Cartitems'
import useStyles from './styles'

const Cart = ({ cart , handleRemoveFromCart , handleUpdateCartQty , handleEmptyCart }) => {
    const classes = useStyles();

    console.log(cart)

      

    //function returning only jsx ,, not a sub component
    const Emptycart = () => (
        <Typography variant="subtitle1">You have no items in your shopping cart , 
            <Link to='/' className={classes.link}>start adding some </Link>!
        </Typography>
    );

    const Filledcart = () =>(
        <>
            <Grid container spacing={3}>

            {cart.line_items.map((lineitem) => (
                <Grid item  xs={12} sm={4} key={lineitem.id}>
                   <Cartitems   item={lineitem} onRemoveFromCart={handleRemoveFromCart} onUpdateCartQty={handleUpdateCartQty} /> 
                </Grid>
            ))}
            </Grid>

            <div className={classes.cardDetails}>
                <Typography>Subtotal : {cart.subtotal.formatted_with_symbol}</Typography>
                <div>
                    <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={handleEmptyCart} >Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary'>Checkout</Button>
                </div>
            </div>

        </>
    );

    if(!cart.line_items) return 'lodaing..';


    //cart.line_items.length if cart length is 0 = falsy then !0 = true .. other than 0 everying is truthy then 4 = truthy and !4 = falsy ..

  return (
    <Container>
        <div className={classes.toolbar} /> 
        <Typography className={classes.title} variant='h3' gutterBottom >Your Shopping Cart</Typography>
        {!cart.line_items.length ? <Emptycart/> : <Filledcart/>}
    </Container>
  )
}

export default Cart;