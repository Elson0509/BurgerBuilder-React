import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component{
    state = {
        orderForm:{
                name: {
                    elementtype: 'input',
                    elementconfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                street: {
                    elementtype: 'input',
                    elementconfig: {
                        type: 'text',
                        placeholder: 'Street'
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                zipcode: {
                    elementtype: 'input',
                    elementconfig: {
                        type: 'text',
                        placeholder: 'Your ZIP Code'
                    },
                    value: '',
                    validation:{
                        required: true,
                        minLength: 6,
                        maxLength: 6
                    },
                    valid: false,
                    touched: false
                },
                country: {
                    elementtype: 'input',
                    elementconfig: {
                        type: 'text',
                        placeholder: 'Your Country'
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                email: {
                    elementtype: 'input',
                    elementconfig: {
                        type: 'email',
                        placeholder: 'Your E-mail'
                    },
                    value: '',
                    validation:{
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                deliveryMethod: {
                    elementtype: 'select',
                    elementconfig: {
                        options: [
                            {value: 'fastest', displayValue:'Fastest'},
                            {value: 'cheapest', displayValue:'Cheapest'}
                        ]
                    },
                    value: 'fastest',
                    validation:{},
                    valid: true
                },
        },
        formIsValid: false,
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading:true});
        let formData = {};
        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ingredients,
            //On a real project, it is necessary to calculate again on server 
            //the price to avoid manipulation from the user.
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading:false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({loading:false});
            });
    }

    checkValidity(value, rules){
        let isValid = true;
        
        if (rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //with this command above it only copy the content that are
        //not nested
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        //now the overall form validation
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }
        console.log(formIsValid);
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});

    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        elementtype={formElement.config.elementtype} 
                        elementconfig={formElement.config.elementconfig} 
                        value={formElement.config.value}
                        key={formElement.id}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid} clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if(this.state.loading){
            form = <Spinner/>
        }
        return(
            <div className={classes.ContactData}> 
                <h4>Enter your contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;