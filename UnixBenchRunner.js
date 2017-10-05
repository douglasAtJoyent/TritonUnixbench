var consts = require('./UnixBenchRunnerContants');
function UnixBenchRunner(name,package,image,fileOutput) { 
	this.name = name;
        var exec = require('child_process').execSync
	this.user = "root";
        this.package = package;
        this.image = image;	
	this.file = fileOutput;
}

UnixBenchRunner.prototype.spawnNewInstance = function() { 
    var exec = require('child_process').execSync; 
    // We need the while loop because the -j does not give back correct json
    var packageCommand = "triton package list name=" + this.package  + " -j | while read -r line; do echo $line|json id ; done;";
    console.log("PACKAGE COMMAND : " + packageCommand);
    var imageCommand = "triton image list name=" + this.image + " type=lx-dataset -j | while read -r line; do echo $line|json id ; done;";
    console.log("IMAGE COMMAND : " + imageCommand);

    this.packageId = exec(packageCommand).toString();
    this.packageId = this.packageId.replace("\n","");
     
    this.imageId = exec(imageCommand).toString();
    this.imageId = this.imageId.split("\n")[1]; 
    this.imageId = this.imageId.replace("\n",""); 
    
    var createString = "triton inst create --name=" + this.name + " " + this.imageId + " " + this.packageId;
    console.log(createString + "\n");
    var createOutput = exec(createString).toString();
    console.log(createOutput);  

    var stateCommand  = "triton inst get " + this.name + " | json state"; 
    console.log(stateCommand + "\n");
    while(exec(stateCommand).toString().indexOf("running") == -1) { 
    	console.log("Machine is not up yet");
        exec("sleep 10"); 
    } 
    var getAddressCommand = "triton inst get " + this.name +  " | json ips[0]";
    this.address = exec(getAddressCommand).toString();
    this.address = this.address.replace("\n","");
}

UnixBenchRunner.prototype.installSoftware = function() { 
    if(this.image == consts.UBUNTU_14) { 
        installCommand = "ssh -o StrictHostKeyChecking=no root@" + this.address + " < ubuntu16_unixbench.sh";
        var exec = require('child_process').execSync;
        console.log("Using install command : " + installCommand);
        var assignKeyOutput = exec(installCommand).toString();
        console.log("Done installing");         
    } 
    if(this.image == consts.UBUNTU_16) { 
        installCommand = "triton ssh " + this.name + " -o StrictHostKeyChecking=no < ubuntu16_unixbench.sh";
        var exec = require('child_process').execSync;
        console.log("Using install command : " + installCommand);
        var assignKeyOutput = exec(installCommand).toString();
        console.log("Done installing");
    }
    if(this.image == consts.CENT_6 || this.image == consts.CENT_7) { 
        installCommand = "triton ssh " + this.name + " -o StrictHostKeyChecking=no < centOS_unitxbench.sh";
        console.log(installCommand);
	var exec = require('child_process').execSync;
        console.log("Using install command : " + installCommand);
        var assignKeyOutput = exec(installCommand).toString();
        console.log("Done installing"); 
    }
}


UnixBenchRunner.prototype.runUnixBench= function() {
     console.log("Starting the unixbench"); 
     var simpleCommand = "triton ssh " + this.name + " -o StrictHostKeyChecking=no < runUnixBench.sh&";
     var exec = require('child_process').execSync;
     var assignKeyOutput = exec(simpleCommand).toString();
     console.log("Ending unixbench"); 
}

UnixBenchRunner.prototype.downloadResult = function(filename) {
  console.log("FILENAME : " + filename);
  console.log("Address: " + this.address );
  var downloadCommand = "scp root@" + this. address + ":/root/unixbench/unixbench.txt ./output/" + filename;
  var exec = require('child_process').execSync;
  console.log("SCP : " + downloadCommand);  
  exec(downloadCommand);
}



UnixBenchRunner.prototype.reset = function() { 
       var exec = require('child_process').execSync;
       var cleanup = "triton start --snapshot=testStart " + this.image;
       exec(cleanup).toString(); 
}

UnixBenchRunner.prototype.startTest = function() { 
       var exec = require('child_process').execSync;
       var cleanup = "triton ssh " + this.image + " \"/root/unixbench/run.sh\"";
       exec(cleanup).toString(); 
}

UnixBenchRunner.prototype.downloadResult = function(image) { 
       var exec = require('child_process').execSync;
       var cleanup = "scp root@" + this.address + ":/root/unixbench/unixbench.txt ./output/`date +%s`";
       exec(cleanup).toString(); 
}

UnixBenchRunner.prototype.stopTest = function() { 
       var exec = require('child_process').execSync;
       var cleanup = "triton stop inst " + this.image;
       exec(cleanup).toString(); 
}

UnixBenchRunner.prototype.cleanup = function() { 
       var exec = require('child_process').execSync;
       var cleanup = "triton inst delete " + this.name;
       exec(cleanup).toString(); 
}

module.exports =  UnixBenchRunner;
