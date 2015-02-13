Frontends = new Meteor.Collection("frontends");

var frontends = [
  {authorName: "useraccounts", baseName: "bootstrap"  , fUrl: "http://getbootstrap.com/"},
  {authorName: "useraccounts", baseName: "foundation" , fUrl: "http://foundation.zurb.com/"},
  {authorName: "useraccounts", baseName: "ionic"      , fUrl: "http://ionicframework.com/"},
  {authorName: "useraccounts", baseName: "materialize", fUrl: "http://materializecss.com/"},
  {authorName: "useraccounts", baseName: "polymer"    , fUrl: "https://www.polymer-project.org/"},
  {authorName: "useraccounts", baseName: "semantic-ui", fUrl: "http://semantic-ui.com/"},
  {authorName: "useraccounts", baseName: "ratchet"    , fUrl: "http://goratchet.com/"},
  {authorName: "useraccounts", baseName: "unstyled"   , fUrl: ""},
];

_.each(frontends, function(frontend){
  var f = Frontends.findOne(frontend);
  if (!f) {
    Frontends.insert(frontend);
  }
});

/*
Sample object got from the response
{
  "installs-per-year": 385,
  "latestVersion": {
    "published": {
      "$date": 1422485989711
    },
    "version": "1.6.1",
    "git": "https://github.com/meteor-useraccounts/core.git",
    "description": "Meteor sign up and sign in templates core package.",
    "readme": "https://warehouse.meteor.com/readme/u8BPj5eWZzHQiFM6q/1422485987517/AnhA9SZLf3/useraccounts:core-1.6.1-readme.md",
    "unmigrated": false
  },
  "name": "useraccounts:core",
  "score": 1.7110424750212552,
  "starCount": 35
}
*/

var getPkgData = function(){
  var pkgNames = _.map(frontends, function(frontend){
    return frontend.authorName + ":" + frontend.baseName;
  }).join(",");
  Meteor.http.get(
    "https://atmospherejs.com/a/packages/findByNames?names=" + pkgNames,
    {
      headers: {'Accept': 'application/json'}
    },
    function(error, response){
      console.log("Getting packages data from atmosphere...");
      // Goes through each package
      if (!error) {
        _.each(response.data, function(pkg){
          var
            pkgName = pkg.name.split(":"),
            authorName = pkgName[0],
            baseName = pkgName[1]
          ;
          if (authorName === "useraccounts") {
            var frontend = Frontends.findOne({baseName: baseName});
            if (frontend) {
              var newFields = _.pick(pkg, 'name', 'starCount');
              if (pkg.latestVersion && pkg.latestVersion.version) {
                newFields.version = pkg.latestVersion.version;
              }
              if (pkg["installs-per-year"]) {
                newFields.count = pkg["installs-per-year"];
              }
              console.log('--');
              console.dir(newFields);
              Frontends.update(frontend._id, { $set: newFields });
            }
          }
        });
      }
    }
  );
};

getPkgData();
Meteor.setInterval(getPkgData, 3600 * 1000); // every hour


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
