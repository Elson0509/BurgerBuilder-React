import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    // state={
    //     ingredients:null,
    //     totalPrice: 0
    // }
    
    // componentWillMount(){
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price;
    //     for(let param of query.entries()){
    //         if(param[0] === 'price'){
    //             price = param[1];
    //         }else{
    //             ingredients[param[0]] = +param[1]; //the + convert to a number
    //         }
    //     }   
    //     this.setState({ingredients: ingredients, totalPrice: price});
    // }

    state = this.myInitializeStateMethod();

    myInitializeStateMethod() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if (param[0] === 'price') {
                price = param[1];
            } else {
                ingredients[param[0]] = +param[1]; //the + convert to a number
            }
        }
        return {ingredients: ingredients, totalPrice: price};
    }

    checkoutCancelledhandler = () =>{
        this.props.history.goBack();
    
    }
    checkoutContinuedhandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

    render(){
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledhandler}
                    checkoutContinued={this.checkoutContinuedhandler}/>
                <Route path={this.props.match.path + '/contact-data'} 
                render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)}/> 
            </div>
        );
    }
}

export default Checkout;