import React , {useState , useEffect} from 'react'
import { Paper , Stepper , StepLabel , Typography , Step , CircularProgress , Divider , Button } from '@material-ui/core'
import useStyles from './styles'

import { commerce } from '../../../lib/commerce'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import Commerce from '@chec/commerce.js';
import Cart from '../../Cart/Cart';

const steps = ['Shipping address' , 'Payment details']

const Checkout = ( {cart} ) => {
    console.log(cart)
    const [activestep, setActivestep] = useState(0);
    const [checkoutToken , setCheckoutToken] = useState(null);
    const [shippingData , setShippingData] = useState({})
    const classes = useStyles();

    useEffect(() => {
        // checkouttoken
        const generateToken = async () => {
            try{
            const Token = await commerce.checkout.generateToken( cart.id , {type : 'cart'})
            // console.log(Token)
            setCheckoutToken(Token)
            }catch{

            }
        }
        generateToken();

    },[])

    const nextstep = () => setActivestep((prevActivestep) => prevActivestep + 1)
    const backstep = () => setActivestep((prevActivestep) => prevActivestep - 1)

    const Next = (data) =>{
        setShippingData(data); // passing checkout form data from addressfrom via props.. 
        nextstep();
    }

    const Confirmation = () => (
        <div>
            Confirmation
        </div>
    )


    const Form = () => activestep === 0 ? 
        <AddressForm checkoutToken={checkoutToken} Next={Next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} />


  // how react works  1. render jsx -> then goto component did mount in this case (i.e) useEffect .. so adding checkouttoken before form
 

  return (
    <>
        <div className={classes.toolbar} />
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant='h4'>Checkout</Typography>
                <Stepper activeStep={activestep} className={classes.stepper}>
                    {steps.map((step)=>(
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            {activestep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
            </Paper>
        </main>

    </>
  )
}

export default Checkout