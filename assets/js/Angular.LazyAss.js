var LazyAss = new namespace("LazyAss");


LazyAss.Angular = angular.module('LazyAss', []).
	config(function() { // provider-injector
		// This is an example of config block.
		// You can have as many of these as you want.
		// You can only inject Providers (not instances)
		// into the config blocks.
		console.log("Config Module");
	}).
	run(function() { // instance-injector
		// This is an example of a run block.
		// You can have as many of these as you want.
		// You can only inject instances (not Providers)
		// into the run blocks
		console.log("Run Module");
	});


