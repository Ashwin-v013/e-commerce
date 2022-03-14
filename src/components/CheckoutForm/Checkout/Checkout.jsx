import React , {useState , useEffect} from 'react'
import { Paper , Stepper , StepLabel , Typography , Step , CircularProgress , Divider , Button , CssBaseline } from '@material-ui/core'
import useStyles from './styles'

import { commerce } from '../../../lib/commerce'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import Commerce from '@chec/commerce.js';
import Cart from '../../Cart/Cart';
import { Link , useNavigate } from 'react-router-dom';

const steps = ['Shipping address' , 'Payment details']

const Checkout = ( {cart , onCaptureCheckout , error , order , refreshCart} ) => {

    // console.log(cart)
    const [activestep, setActivestep] = useState(0);
    const [checkoutToken , setCheckoutToken] = useState(null);
    const [shippingData , setShippingData] = useState({});
    const [isFinished , setIsFinished] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();

    useEffect(() => {
        // checkouttoken
        const generateToken = async () => {
            try{
            const Token = await commerce.checkout.generateToken( cart.id , {type : 'cart'})
            // console.log(Token)
            setCheckoutToken(Token)
            }catch{
                navigate.pushState('/')
            }
        }
        generateToken();

    },[cart])

    const nextstep = () => setActivestep((prevActivestep) => prevActivestep + 1)
    const backstep = () => setActivestep((prevActivestep) => prevActivestep - 1)

    const Next = (data) =>{
        setShippingData(data); // passing checkout form data from addressfrom via props.. down to up 
        nextstep();
    }

    const timeout = () =>{
        setTimeout(() => {
            setIsFinished(true)
        }, 3000);
    }

    let Confirmation = () => order.customer ?  (

        <>
            <div>
                <Typography variant="h5">Thank you for your purchase , {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider classsName={classes.divider}></Divider>
                <Typography variant="subtitle2">Order ref : {order.customer_refrence}</Typography>
            </div>
            <br/>
            <Button component={Link} to="/" variant='outlined'  type='button'>Back to Home</Button>
        </>
    ) : isFinished ? (
        <>
        <div>
            <Typography variant="h5">Thank you for your purchase</Typography>
            <Divider classsName={classes.divider}></Divider>
        </div>
        <br/>
        <Button component={Link} to="/" variant='outlined'  type='button'>Back to Home</Button>
    </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress/>
        </div>
    );

    if(error) {
        <>
            <Typography>Error: {error}</Typography>
            <br/>
            <Button component={Link} to='/' variant='outlined' type='button' >Bak to home</Button>
        </>

    }


    const Form = () => activestep === 0 ? 
        <AddressForm checkoutToken={checkoutToken} Next={Next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} onCaptureCheckout={onCaptureCheckout} nextstep={nextstep} backstep={backstep} timeout={timeout} refreshCart={refreshCart}  />


  // how react works  1. render jsx -> then goto component did mount in this case (i.e) useEffect .. so adding checkouttoken before form
 

  return (
    <>
    <CssBaseline/>
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
            {activestep === steps.length ? <Confirmation/> : (checkoutToken ?  <Form/> :<div className={classes.spinner}><CircularProgress/></div>)}
            </Paper>
        </main>

    </>
  )
}

export default Checkout