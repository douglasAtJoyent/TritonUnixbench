const consts = require('./UnixBenchRunnerContants');
const unixBenchRunner = require('./UnixBenchRunner');
const config = require('./config.js');
var packages = config.PACKAGES;
var images = config.OS;
console.log(images[0]);
images.forEach(function(image) { 
  packages.forEach(function(package) { 
     try { 
      var name = "unixbench_" + image;
      console.log("Start the create process " + image+ " with name : " + name);
      var runner = new unixBenchRunner(name,packages[0],image,"fileOutput.txt");
      console.log("************** ----- " + runner.name + " ************* ");
      runner.spawnNewInstance();
      runner.installSoftware();
      runner.runUnixBench();
   } catch(e) { 
      console.log("Failed to load software" + e );
   }
  });
}); 
