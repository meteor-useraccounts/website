Template.frontendCard.rendered = function(){
	$('.frontend.card .image').dimmer({
  	on: 'hover'
	});
};

var capName = function(){
	return _.capitalize(this.name);
};

Template.frontendCard.helpers({
	capName: capName,
	description: function(){
		var text = '';
		if (this.name === "unstyled") {
			text += 'See it in action on <a href="http://crater.io/" target="_blank">Crater.io</a>';
		}
		else {
			text += 'Styled for <a href="' + this.frontendUrl + '" target="_blank">' + capName.call(this) + '</a>';
		}
		return text;
	},
	pkgUrl: function(){
		var part = this.packageName.split(":");
		return "https://atmospherejs.com/" + part[0] + "/" + part[1];
	}
});
