

var replace = require('replace-in-file');
var package = require("./package.json");
var buildVersion = package.version;
const options = {
    files: 'src/environments/environment.prod.ts',
    from: /Version: '(.*)'/g,
    to: "Version: 'Ver "+ buildVersion +' ('+ (new Date().toDateString()) +')' + "'",
    allowEmptyPaths: false,
};

const options1 = {
  files: 'src/environments/environment.stage.ts',
  from: /Version: '(.*)'/g,
  to: "Version: 'STAGE Ver "+ buildVersion +' ('+ (new Date().toDateString()) +')' + "'",
  allowEmptyPaths: false,
};

const options2 = {
  files: 'src/environments/environment.ts',
  from: /Version: '(.*)'/g,
  to: "Version: 'DEV Ver "+ buildVersion +' ('+ (new Date().toDateString()) +')' + "'",
  allowEmptyPaths: false,
};

 var buildVersion2 = buildVersion.replace(/\./g,'_');
// const indexhtmlfile = {
//   files: 'src/index.html',
//   from:/<html .*/g,
//   to: "<html lang=\"en\" manifest=\"cacheManifest"+buildVersion2+".mf\">",
//   allowEmptyPaths: false,
// };

// const serviceworker2= {
//   files: 'src/service-worker-browser.js',
//   from:/const cacheName .*/g,
//   to: "const cacheName = 'ILA_cache_"+buildVersion2+"';",
//   allowEmptyPaths: false,
// };


try {
    let changedFiles = replace.sync(options);
    let changedFiles1 = replace.sync(options1);
    let changedFiles2 = replace.sync(options2);
    // let changedFiles3 = replace.sync(indexhtmlfile);
    //let changedFiles4 = replace.sync(serviceworker2);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    }
    console.log('Build version set: ' + buildVersion);
}
catch (error) {
    console.error('Error occurred:', error);
    throw error
}
