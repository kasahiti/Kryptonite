#!/bin/bash
sudo apt install openjdk-17-jdk python3.9 python3-pip git
sudo ln -s /usr/bin/python3.9 /usr/bin/python
sudo pip install check50
sudo mkdir /kryptonite-students
sudo chown -R debian: /kryptonite-students/
sudo chmod 775 /kryptonite-students/