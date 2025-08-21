#!/bin/bash

# A simple script to gather and print system information.

echo "--- System Information ---"
echo "Date: $(date)"
echo

echo "--- OS Release Information ---"
# The cat /etc/redhat-release command will show the RHEL version
if [ -f /etc/redhat-release ]; then
  cat /etc/redhat-release
else
  echo "Not a Red Hat-based system."
fi
echo

echo "--- Kernel Version ---"
uname -r
echo

echo "--- Script Test Complete ---"