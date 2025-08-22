# Use the official Red Hat Universal Base Image 9
FROM registry.access.redhat.com/ubi9/ubi:latest

# Set the working directory inside the container
WORKDIR /app

# Install necessary tools and create the empty fstab file
RUN dnf -y update && \
    dnf -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm && \
    dnf -y install dos2unix util-linux && \
    touch /etc/fstab && \
    dnf clean all

# Copy your test scripts into the container
COPY test-scripts/ /app/

# Run dos2unix on all shell scripts in /app to fix line endings
RUN dos2unix /app/*.sh