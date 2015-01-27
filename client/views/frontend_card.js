Template.frontendCard.rendered = function(){
	$('.frontend.card .image').dimmer({
  	on: 'hover'
	});
};

var capName = function(){
	return _.capitalize(this.baseName);
};

Template.frontendCard.helpers({
	capName: capName,
	description: function(){
		var text = '';
		if (this.baseName === "unstyled") {
			text += 'See it in action on <a href="http://crater.io/" target="_blank">Crater.io</a>';
		}
		else {
			text += 'Styled for <a href="' + this.fUrl + '" target="_blank">' + capName.call(this) + '</a>';
		}
		return text;
	},
	pkgUrl: function(){
		return "https://atmospherejs.com/" + this.authorName + "/" + this.baseName;
	}
});
