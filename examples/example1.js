var resolver = require('../index')


// configure resolver
var SELF_DOMAIN = 'npmjs.org'
resolver.configure(SELF_DOMAIN, function(err, data){
	console.log('Resolver configured with domain %s: ', data.domain, data.ips)

	// check that domain 
	var DOMAIN_TO_RESOLVE = 'npmjs.org'
	resolver.resolve(DOMAIN_TO_RESOLVE, function(err, data){
		if (err) console.log(err)

		console.log(data)
	})

	var DOMAIN_TO_RESOLVE = 'github.com'
	resolver.resolve(DOMAIN_TO_RESOLVE, function(err, data){
		if (err) {
			return console.log(err)
		}

		console.log(data)
	})

})






