Template.home.helpers({
	frontends: function(){
		return Frontends.find({}, {sort: {installCount: -1, name: 1}});
	}
});
