var dns = require('dns');


exports.SELF_DOMAIN; // should be set first by setup method
exports.ips; // will keep own domain ips afret setup

/**
 * Will configure module with domain name and app ips.
 * @param  {[type]}   selfDomain Domain to configure with.
 * @param  {Function} done(err, ips) Callback function.
 */
exports.configure = function(selfDomain, done){
	exports.SELF_DOMAIN = selfDomain;
	dns.resolve(exports.SELF_DOMAIN, function (err, addresses) {
		if (err) {
			err.message = 'WARNING! Cant populate DNS record for ' + exports.SELF_DOMAIN;
			err.code = 'norecord'
			console.log(err);
			return done && done(err);
		}
		addresses = addresses || [];
		if(!addresses.length) {
			err.message = 'WARNING! There is no ip addresses populated for domain '+ exports.SELF_DOMAIN; 
			err.code = 'norecord'
			console.log(err);
			return done && done(err);
		}

		//console.log(exports.SELF_DOMAIN + ' addresses populated: ' + JSON.stringify(addresses));
		exports.ips = addresses;
		done && done(null, {domain:selfDomain, ips:exports.ips});
	})
}

/**
 * Check that passed domain points to domain passed to configure().
 * @param  {[type]}   domain Domain to check.
 * @param  {Function} done   Callback(err, ip). 
 */
exports.resolve = function(domain, done){
	if(!exports.SELF_DOMAIN) return done && done(new Error('Module not configured. Run configure method first'))
	if(!exports.ips) return done && done(new Error('There are no ips for configured domain '+exports.SELF_DOMAIN))
	dns.resolve(domain, function (err, addresses) {
		if (err) {
			err.message = 'Cant populate DNS record for ' + domain;
			err.code = 'norecord'
			// console.log(err);
			return done && done(err);
		}
		addresses = addresses || [];
		if(!addresses.length) {
			err.message = 'DNS record for domain '+domain +' not found. Make sure that record exists and wait 24 hours.';
			err.code = 'norecord'
			// console.log(err);
			return done && done(err);
		}

		//console.log(domain + ' addresses: ' + JSON.stringify(addresses));

		// ensure that at least one of addresses points to
		var matched = false;
		addresses.forEach(function(address){
			if(exports.ips.indexOf(address) !== -1){
				matched = address;
			}
		})

		if(matched){
			return done && done(null, matched);
		}else{

			var err = new Error('DNS record for '+domain +' points to another ip adress ['+addresses+']');
			err.code = 'anotherip'
			// console.log(err);
			return done && done(err, addresses)
		}
	})
}