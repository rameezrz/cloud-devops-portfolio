#!/bin/bash
set -euo pipefail

# Disabling sshd
sudo systemctl disable --now sshd

# Update packages
dnf update -y
              
# Install Docker
dnf install -y docker
              
# Start and enable Docker daemon
systemctl start docker
systemctl enable docker
              
# Add the default ec2-user to the docker group to run commands without sudo
usermod -aG docker ec2-user