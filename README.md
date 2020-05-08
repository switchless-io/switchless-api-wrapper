# API wrapper

As the name suggests that is a simple api wrapper. Wrap your API backend build with switchless and others can make API requests in a simple manner. 

The purpose of this wrapper is to make your code more readable. 

### Without switchless API wrapper
```
var url =api_endpoint+'/invoices?secret='+secret+'&filing='+results.getGstr2aFiling.id; 
console.log(url);
var options = {
  'method': 'GET',
  'url': url,
};
request(options, function (error, response) { 
  if (error) callback(error);
  var body = JSON.parse(response.body);
  callback(error,body);
});
```

More lines of code describing how to make the API request. It takes your attention off the business logic that you are working on. Want to add another query parameter, you need to write `+'&query_param='+query`

### With switchless API wrapper

In the previous case, you need to think about implementation logic while thinking about business logic. Switchless is all about minimising switching. This package hides the implementation logic so that you can stay focused on business logic. 

Initial setup
```
var SwitchlessAPIWrapper = require('switchless-api-wrapper');
var settings = {
	base_url:'https://app.mralbert.in/apis/v1',
	auth:{
		type:'secret_key',
		key:'secret',
		value:'the_big_secret_key',
		via:'query_params'
	},
	headers:{
		// headers that you want to include in all requests
	},
	body:{
		// body params that you want to include in all requests. (Does not apply to GET requests)
	},
	query:{
		// query params that you want to include in all requests
	},
	timeout:60000, // in milli seconds
	parse_body:true, // defaults to true
}
var api = new SwitchlessAPIWrapper(options);

```

typical usage
```
var options={
	url:'/invoices',
	method:'GET',
	query:{
		filing:results.getGstr2aFiling.id,
		limit:100
	},
}

api.request(options,function(err,response){
	callback(err,response.body) // response body is already converted to JSON
})
```

### Examples

#### Find many objects
```
var options = {
	'url': '/invoices',
	query:{
		remote_id:invoice.remote_id,
		type:'income',
		seller_gst_no:invoice.seller_gst_no,
		buyer_gst_no:invoice.buyer_gst_no
	},
};
mralbert.request(options,function(err,response){
	if (err) return callback(err);
	callback(err,response.body);
})
```
#### Find one
```
var options = {
	'url': '/gstins',
	query:{
		value:config.client.gstin,
	},
};
mralbert.request(options,function(err,response){
	if (err) return callback(err);
	if(response.body.length==0)
		return callback('No GSTIN found');
	if(response.body.length!=1)
		return callback('More than one gstin found. Something is wrong');
	customer_gstin=response.body[0];
	callback(err,response.body[0]);
})
```

#### Create object 
```
var options = {
	'method':'POST',
	'url': '/invoices',
	body:invoice,
};
console.log(options);
mralbert.request(options,function(err,response){
	if (err) return callback(err);
	// console.log(err);
	console.log(response.body);
	callback(err,response.body);
})
```
Response will return the created object by default, fully populated

#### Update one object
```
var options = {
	method:'PATCH',
	'url': '/invoices/'+invoice.id,
	body: {
		'remote_id': invoice.remote_id.trim(),
		'seller_gst_no':invoice.seller_gst_no.trim(),
		'buyer_gst_no':invoice.buyer_gst_no.trim()
	}
};
// console.log(options);
mralbert.request(options,function(err,response){
	// console.log('err');
	// console.log(err);
	console.log(response.body.remote_id);
	// callback(err,response.body);
	next(err);
})
```
Response will return the updated object.

### Supports multiple authentication strategies (coming soon)

For now the package supports master secret key specified via query params. 


settings 
- query
- headers
- body
- parse_body
- base_url
- timeout