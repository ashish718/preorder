import {useState} from 'react'
import axios from 'axios'

function PreBookForm() {
const [name, setName] = useState('')
const [phone, setPhone] = useState('')
const [email, setEmail] = useState('')
const [address, setAddress] = useState('')

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


  let formSubmit = async (e)=>{
    e.preventDefault()

  let  request = {
      url : 'http://13.127.23.167:9000/pre/order',
      params: {name, email, phone, p_id:5898458366108, vId:36845332660380},
      method: "get"
    }

    let data = await axios(request)
    console.log(data, "data after submission");
      if (data) {
        console.log(data.data);
        var options = {
    "key": data.data.key, // Enter the Key ID generated from the Dashboard
    "amount": data.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Noise",
    "description": "Pre Book Order ",
    // "image": "https://example.com/your_logo",
    "order_id": data.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "http://13.127.23.167:9000/pre/order/callback",
    "prefill": {
        "name": name,
        "email": email,
        "contact": phone
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

    // await  axios.get(`http://localhost:8000/pre/payment/${name}/${email}/${phone}/${address}`)
    // .then(async result=>{
    //   console.log(result.data, "data")
    //   let details = { action:'https://securegw-stage.paytm.in/order/process', params:result.data}
    //   post(details)
    // })
    // .catch(error=>{
    //   console.log(error, "error is");
    // })
  }


  return (
    <div>
      <p> Pre Book</p>
      <form onSubmit={formSubmit}>
      <input type="text" placeholder="Full Name" onChange={e=>setName(e.target.value)}/>
      <input type="text" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
      <input type="text" placeholder="phone no" onChange={e=>setPhone(e.target.value)}/>
      <input type="text" placeholder="Shipping Address" onChange={e=>setAddress(e.target.value)}/>
      <button type="submit">Pay & Book Now</button>

    </form>
    </div>
  );
}

export default PreBookForm;
