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



### Supports multiple authentication strategies (coming soon)

For now the package supports master secret key specified via query params. 


settings 
- query
- headers
- body
- parse_body
- base_url
- timeout