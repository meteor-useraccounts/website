Frontends = new Meteor.Collection("frontends");

var frontends = [
	{baseName: "bootstrap"  , fUrl: "http://getbootstrap.com/"},
	{baseName: "foundation" , fUrl: "http://foundation.zurb.com/"},
	{baseName: "ionic"      , fUrl: "http://ionicframework.com/"},
	{baseName: "polymer"    , fUrl: "https://www.polymer-project.org/"},
	{baseName: "semantic-ui", fUrl: "http://semantic-ui.com/"},
	{baseName: "ratchet"    , fUrl: "http://goratchet.com/"},
	{baseName: "unstyled"   , fUrl: ""},
];

Frontends.remove({});
_.each(frontends, function(frontend){
	Frontends.insert(frontend);
});



/* Atmosphere integration */
atmosphereDDP = DDP.connect('https://atmospherejs.com/');

var Packages = new Mongo.Collection('packages', { connection: atmosphereDDP });
var InstallCounts = new Mongo.Collection('installCounts', { connection: atmosphereDDP });

atmosphereDDP.subscribe('packages/search', 'useraccounts', 20);


Packages.find().observeChanges({
  added: function(id, fields) {
    if (fields.authorName === "useraccounts") {
      var frontend = Frontends.findOne({baseName: fields.baseName});
      if (frontend) {
        var newFields = _.pick(fields, 'authorName', 'baseName', 'name', 'starCount');
        if (fields.latestVersion && fields.latestVersion.version) {
          newFields.version = fields.latestVersion.version;
        }
        newFields.pkg_id = id;
        Frontends.update(frontend._id, { $set: newFields });
        atmosphereDDP.subscribe('package/installs', fields.name);
      }
    }
  },
  changed: function(id, fields) {
    var frontend = Frontends.findOne({pkg_id: id});
    if (frontend) {
      var newFields = _.pick(fields, 'authorName', 'baseName', 'name', 'starCount');
      if (fields.latestVersion && fields.latestVersion.version) {
        newFields.version = fields.latestVersion.version;
      }
      Frontends.update(frontend._id, { $set: newFields });
    }
  },
  removed: function(id) {
    // TODO, could index and remove names that are removed
  }
});


InstallCounts.find().observeChanges({
  added: function(id, fields) {
    var frontend = Frontends.findOne({name: fields.name});
    if (frontend) {
      var newFields = {
        count: fields.count,
        ic_id: id,
      };
      Frontends.update(frontend._id, { $set: newFields });
    }
  },
  changed: function(id, fields) {
    var frontend = Frontends.findOne({ic_id: id});
    if (frontend) {
      if (count in fields) {
        Frontends.update(frontend._id, { $set: { count: fields.count } });
      }
    }
  },
  removed: function(id) {
    // TODO, could index and remove names that are removed
  }
});

Meteor.publish('frontends', function() {
  return Frontends.find({}, {
    fields: {
        authorName: 1,
        baseName: 1,
        count: 1,
        fUrl: 1,
        name: 1,
        starCount: 1,
        version: 1,
    }
  });
});
