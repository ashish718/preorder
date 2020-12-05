import React from 'react'

import {useState, useEffect} from 'react'
import axios from 'axios'

let PreOrderDetails = ()=>{

const [orderData, setOrderData] = useState([])

useEffect(()=>{
fetchOrder()
},[])

function isDate(val) {
  // Cross realm comptatible
  return Object.prototype.toString.call(val) === '[object Date]'
}

function isObj(val) {
  return typeof val === 'object'
}

 function stringifyValue(val) {
  if (isObj(val) && !isDate(val)) {
    return JSON.stringify(val)
  } else {
    return val
  }
}

function buildForm({ action, params }) {
  const form = document.createElement('form')
  form.setAttribute('method', 'post')
  form.setAttribute('action', action)
  //form.setAttribute('target', target)

  Object.keys(params).forEach(key => {
    const input = document.createElement('input')
    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', stringifyValue(params[key]))
    form.appendChild(input)
  })

  return form
}

 function post(details) {
  const form = buildForm(details)
  document.body.appendChild(form)
  form.submit()
  form.remove()
}

let fetchOrder = async()=>{
  let data = await axios.get('http://13.127.23.167:9000/pre/order/status/new@new.com')
  console.log(data)
  setOrderData(data.data)
}

let payAmount = async(e, order)=>{
  e.preventDefault()
  let  request = {
      url : `http://13.127.23.167:9000/pre/order/payment/${order.order_id_system}`,
      method: "get"
    }

    let data = await axios(request)
    if (data) {
      console.log(data.data);
      var options = {
  "key": "rzp_test_RG3HQJZoFpPhs5", // Enter the Key ID generated from the Dashboard
  "amount": data.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  "currency": "INR",
  "name": "Noise",
  "description": "Pre Book Order ",
  // "image": "https://example.com/your_logo",
  "order_id": data.data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  "callback_url": "http://13.127.23.167:9000/pre/order/callback",
  "prefill": {
      "name": data.data.name,
      "email": data.data.email,
      "contact": data.data.phone
  },
  "notes": {
      "address": "Nexxbase Marketing Pvt. Ltd,  Gurgaon"
  },
  "theme": {
      "color": "#3399cc"
  }
};
var rzp1 = new window.Razorpay(options);
rzp1.open()
    }
    else {
      console.log("no data found");
    }
}


  return(
    <div>
    <table>
    <thead>
      <tr>
      <th>created_at</th>
      <th>Booking Id</th>
      <th>Product</th>
      <th>Shipping Address</th>
      <th>Costs</th>
      <th>Amount Paid</th>
      <th>Pay Rest</th>
      </tr>
      </thead>
      <tbody>
        {orderData.map((order)=> (
          <tr>
          <td>{order.created_at}</td>
          <td>{order.order_id_system}</td>
          <td>{order.product_details.title}</td>
          <td>{order.shipping}</td>
          <td>Rs.{order.product_details.price}</td>
          <td>{order.transaction_details.map(detail=>(
            <ul>
            <li>Rs.{detail.amount/100} | Transac_Id:{detail.id}</li>
            </ul>
          ))}</td>
          <td><button onClick = {(e)=>payAmount(e, order)}>Pay Rest</button><small>Rs.{parseInt(order.product_details.price)-(order.booking_amount)}left</small></td>
          </tr>
        )

        )}

        </tbody>
    </table>
    </div>
  )
}
export default PreOrderDetails
