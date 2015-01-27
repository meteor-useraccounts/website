// Mostly stolen from @gadicc
// https://github.com/gadicc/meteor-famous-views/blob/ff2b57672fbdf43dbfacead9782b69f87b10f7de/demo-base/server/atmosphere.js
// https://github.com/gadicc/meteor-famous-views/blob/64ced77ff03e868be97c107d0f419d8b9763d91a/demo-base/client/more/plugins.js

Packages = new Mongo.Collection('packages');
InstallCounts = new Mongo.Collection('installCounts');

Meteor.subscribe('packages');
Meteor.subscribe('installCounts');

Frontends = new Meteor.Collection(null);

var frontends = [
	{name: "bootstrap"  , frontendUrl: "http://getbootstrap.com/"},
	{name: "foundation" , frontendUrl: "http://foundation.zurb.com/"},
	{name: "ionic"      , frontendUrl: "http://ionicframework.com/"},
	{name: "polymer"    , frontendUrl: "https://www.polymer-project.org/"},
	{name: "semantic-ui", frontendUrl: "http://semantic-ui.com/"},
	{name: "ratchet"    , frontendUrl: "http://goratchet.com/"},
	{name: "unstyled"   , frontendUrl: ""},
];

_.each(frontends, function(frontend){
	frontend.packageName = "useraccounts:" + frontend.name;
	Frontends.insert(frontend);
});

var updateStarsVersion = function(id, fields) {
	if (fields.authorName === "useraccounts") {
		Frontends.update(
			{
				packageName: fields.name
			},
			{
				$set: {
					starCount: fields.starCount,
					version: fields.latestVersion.version
				}
			}
		);
	}
};

Packages.find().observeChanges({
  added: updateStarsVersion,
	changed: updateStarsVersion,
});

var updateInstallCounts = function(id, fields) {
	if (fields.name.split(":")[0] === "useraccounts") {
		Frontends.update(
			{
				packageName: fields.name
			},
			{
				$set: {
					installCount: fields.count,
				}
			}
		);
	}
};

InstallCounts.find().observeChanges({
  added: updateInstallCounts,
	changed: updateInstallCounts,
});
