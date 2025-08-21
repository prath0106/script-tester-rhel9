# Use the Red Hat Universal Base Image 9 as the foundation
FROM registry.access.redhat.com/ubi9/ubi

# Set a working directory inside the container to keep things tidy
WORKDIR /app

# Update the package lists and install common utilities like 'bash'
# This ensures the environment is up-to-date. Then clean up the cache.
RUN dnf -y update && dnf clean all