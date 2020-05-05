#!/usr/bin/env node

const queryString = require('query-string');
var request = require('request');
var _ = require('lodash');
var merge=function(obj1,obj2){
	var out = _.cloneDeep(obj1);
	if(obj2){
		Object.keys(obj2).forEach(function(key){
			out[key]=obj2[key];
		})
	}
	return out;
}

function Wrapper (settings){
	this.base_url=settings.base_url;
	this.method = 'GET';
	this.query=settings.query?settings.query:{};
	this.headers=settings.headers?settings.headers:{};
	this.body=settings.body?settings.body:{};
	if(settings.parse_body===false)
		this.parse_body=settings.parse_body;
	else 
		this.parse_body=true;
	this.timeout=settings.timeout?settings.timeout:60000;
}

Wrapper.prototype={
	constructor:Wrapper,
	request:function(options,callback){
		full_options={
			method:options.method?options.method:this.method,
			url:this.base_url+options.url,
		};
		var qs_settings = {
			skipNull: true,
			skipEmptyString: true
		}
		var query=merge(this.query, options.query);
		if(query && Object.keys(query).length)
			full_options.url=full_options.url+'?'+queryString.stringify(query, qs_settings);

		var headers = merge(this.headers, options.headers);
		if(headers && Object.keys(headers).length)
			full_options.headers=headers;
		var body = merge(this.body, options.body);
		if(body && Object.keys(body).length)
			full_options.body=body;
		var parse_body = this.parse_body;
		// making the request
		request(full_options, function (error, response) { 
			if (error) callback(error);
			// var body = JSON.parse(response.body);
			if(parse_body)
				response.body=JSON.parse(response.body);
			// console.log(body);
			// if(body.length==0)
			// 	return callback('filing does not exist. create a filing via the app');
			// if(body.length!=1)
			// 	return callback('more than one filing found. Something is seriously wrong');
			callback(error,response);
		});

	}
}
module.exports=Wrapper;