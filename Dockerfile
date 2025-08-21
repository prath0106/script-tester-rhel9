# Use the Red Hat Universal Base Image 9 as the foundation
FROM registry.access.redhat.com/ubi9/ubi

# Set a working directory inside the container to keep things tidy
WORKDIR /app

# Update the package lists to ensure the environment is up-to-date,
# then clean up the dnf cache to keep the image small.
RUN dnf -y update && dnf clean all