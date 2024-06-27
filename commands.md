## Run scripts
    docker run -it -p 8080:3000  portfolio

## build docker image

    docker build -t <name> .

## build multiple docker images

    docker compose build

## create containers from images

    docker compose run

## Build and docker compose run commangs altogether
    doccker compose up // opposite is docker compose stop

## start stopped containers
    docker compose start

## list containers
    docker compose ps

## clean everything similar to `docker system prune` + `--all`
    docker compose down

### github

git config --global user.name "Mona Lisa"

## initializa react project

npm create vite@latest my-vite-app --template react
