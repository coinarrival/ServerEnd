# Use latest node
FROM node:10

# Set the working directory to /ServerEnd
RUN mkdir -p /home/coinArrival/ServerEnd
WORKDIR /home/coinArrival/ServerEnd

# Copy the current directory contents into the container at /ServerEnd
COPY . /home/coinArrival/ServerEnd

# Install any needed packages
RUN npm config set registry http://registry.npm.taobao.org/
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run repo when the container launches
CMD ["npm", "start"]