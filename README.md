# TritonUnixbench

This is a script that will setup and run the unixbench on a Triton system. Though getting the results is still a manual process this will setup the machine. 

To set this up in Triton, I have created a set of node scripts that will create the machine, install the software, and run the scripts.

1. clone the repository 
"git clone https://github.com/douglasAtJoyent/TritonUnixbench.git"
2. Configure the tests. 
Open the file config.js
Edit the package and OS arrays, add/remove the packages and OS that you need to test. This script will run every combination of these configs. A list of valid values for OS is listed in UnixBenchRunnerContants.js. A full list of packages can be found by running "triton package list". 
3. run node runTests.js
4. wait.... the script will take a while to run. 
5. login to the image that is created image, and the results are in the ~/unixbench-testing/result/unixbench.txt.

