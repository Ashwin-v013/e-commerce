import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { commerce } from "./lib/commerce";

import { Products, Navbar, Cart , Checkout } from "./components";
import { set } from "react-hook-form";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    //  console.log(data)

    setProducts(data);
  };

  const fetchCart = async () => {
     
    setCart(await commerce.cart.retrieve());
    // console.log(cart);
  };

  const handleAddtoCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart); //this one for reference .. hereby all cart will be destructured
    // console.log(item.cart);
  };

  const handleRemoveFromCart = async(productId) =>{
    const { cart } = await commerce.cart.remove(productId)

    setCart(cart);
  }
  const handleUpdateCartQty = async(productId , quantity) =>{
    const { cart } = await commerce.cart.update(productId , {quantity})

    setCart(cart);
  }
  const handleEmptyCart = async() =>{
    const { cart } = await commerce.cart.empty()

    setCart(cart);
  }

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  } 

  const handleCaptureCheckout = async (checkoutTokenId , neworder) => {

    try {
      const Incomingorder = await commerce.checkout.capture(checkoutTokenId , neworder);
      setOrder(Incomingorder);
     refreshCart();
    } catch (error) {
      setErrorMessage(error.data.error.message)
    }

  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // console.log(products);

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Products products={products} OnAddtoCart={handleAddtoCart} />
            }
          />

          <Route path="/cart" exact element={
              <Cart
              cart={cart} 
              handleEmptyCart = {handleEmptyCart}
              handleUpdateCartQty={handleUpdateCartQty}
              handleRemoveFromCart ={handleRemoveFromCart} />
              }                
            />
            <Route path="/checkout" element={
              <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage}  refreshCart={refreshCart} />
            } exact/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
