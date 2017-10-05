#!/bin/bash

# This will download, install and run all of the software necessary run the unix bench
#
#

apt-get update
apt-get -y install gcc php5-cli make git
wget https://s3.amazonaws.com/cloudbench/software/UnixBench5.1.3.tgz
tar zxf UnixBench5.1.3.tgz
cd UnixBench
make all
cd ~
git clone git://github.com/cloudharmony/unixbench.git
mkdir -p ~/unixbench-testing/result
/root/unixbench/run.sh --output ~/unixbench-testing/result
