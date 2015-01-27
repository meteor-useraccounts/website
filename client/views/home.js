Template.home.helpers({
	frontends: function(){
		return Frontends.find({}, {sort: {count: -1, baseName: 1}});
	}
});
