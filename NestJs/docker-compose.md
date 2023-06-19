# Starts existing containers for a service.
docker-compose start

# Stops running containers without removing them.
docker-compose stop

# Pauses running containers of a service.
docker-compose pause

# Unpauses paused containers of a service.
docker-compose unpause

# Lists containers.
docker-compose ps

# Builds, (re)creates, starts, and attaches to containers for a service.
docker-compose up

# Stops containers and removes containers, networks, volumes, and images created by up.
docker-compose down

# Run docker database 
docker-compose up dbname -d 
-d => run in the background 

# check if image is running in the background 
docker ps 

# How to access the log 
docker logs ${containerID}