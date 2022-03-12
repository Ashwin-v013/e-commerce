import React , {useEffect, useState} from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./CustomTextField";
import { commerce } from "../../lib/commerce";

const AddressForm = ( {checkoutToken , Next} ) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setshippingOption] = useState('');
  const methods = useForm();
  // console.log(checkoutToken)

  //Why we using a token cause  checkoutToken lists possible countries given in backend of commerce js 

   const fetchShippingCountries = async (checkoutTokenId) => {
    const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);   // it needs s token 
   
    // console.log(countries)

    setShippingCountries(countries)
    setShippingCountry((Object.keys(countries)[0]))
    // setShippingCountry(countries[0]) //note we cannot do this cause countries an object .. have display the first country in the list//
    // console.log((Object.keys(countries)[0])) //  converting objects into arrays 
  
  }

  const fetchSubdivisions = async(countrycode) => {
    const { subdivisions } = await  commerce.services.localeListSubdivisions(countrycode)
    setShippingSubdivisions(subdivisions)
    setShippingSubdivision(Object.keys(subdivisions)[0])
  }

  const fetchShippingOptions = async(checkoutTokenId , country , region = null) => {

      const options  = await commerce.checkout.getShippingOptions(checkoutTokenId , {country , region});

      // console.log(options)
      setShippingOptions(options);
      setshippingOption(options[0].id);
  }

  const countries = Object.entries(shippingCountries).map(([code , name]) => ({ id:code , label:name})); // changing object to array for looping
  // console.log(Object.entries(shippingCountries))

  const subdivisions = Object.entries(shippingSubdivisions).map(([code , name]) => ({ id:code , label:name}))

  const options = shippingOptions.map((shippingOption) => ({ id:shippingOption.id , label:`${shippingOption.description} - ${shippingOption.price.formatted_with_symbol}` }))


  useEffect(() => {
    fetchShippingCountries(checkoutToken.id) 
  },[])
  useEffect(() => {
    if(shippingCountry) fetchSubdivisions(shippingCountry) ;
  },[shippingCountry])
  useEffect(() => {
      if(shippingSubdivision) fetchShippingOptions(checkoutToken.id , shippingCountry , shippingSubdivision )
  },[shippingSubdivision])

 

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => Next({...data , shippingCountry ,  shippingSubdivision ,shippingOption  }))}>
          <Grid container spacing={3}>
            <FormInput required name="firstname" label="First Name" />
            <FormInput required name="lastname" label="Last Name" />
            <FormInput required name="address" label="Address" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zip" label="Zip / Postal Code" />
            
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Country</InputLabel>
                  <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                  {countries.map(country => (
                    <MenuItem key={country.id} value={country.id} >
                      {country.label}
                    </MenuItem>
                    ))}
                  </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Subdivisions</InputLabel>
                  <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                  {subdivisions.map(subdivision => (
                    <MenuItem key={subdivision.id} value={subdivision.id} >
                      {subdivision.label}
                    </MenuItem>
                    ))}
                  </Select>
            </Grid>
           
            <Grid item xs={12} sm={6}>
                <InputLabel>Shipping Options</InputLabel>
                  <Select value={shippingOption} fullWidth onChange={(e) => setshippingOption(e.target.value)}>
                  {options.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                    
                  </Select>
            </Grid>
          </Grid>
          <br />
          <div  style={{ display: "flex" , justifyContent: 'space-between' }}>
            <Button component={Link} to="/cart" variant="outlined" >Back to Cart</Button>
            <Button type="submit" variant="contained" color="primary" >Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
