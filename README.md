# Stretch Auto

A web application to guide users through a quick stretching routine.

# Table of Contents

- [Description](#description)
- [Features](#features)
- [Technology](#technology)
  - [API](#api)
  - [Client](#client)
- [How to Run Locally](#how-to-run-locally)
  - [API](#api-1)
  - [Client](#client-1)
- [Deployment](#deployment)
  - [API](#api-2)
  - [Client](#client-2)
- [Contributing](#contributing)

# Description

Stretch Auto is a web application for guiding users through a timed stretching routine. If you experience any of the
following issues, Stretch Auto is the solution for you!

- Feel sore after a long day of work
- Need to loosen up after a hard workout
- Want to get into a habit of stretching
- Lose track of time while stretching
- Want to explore different stretches
- Have a <strong>deep</strong> passion for stretching

To start stretching, visit http://stretch-auto.seandodson.com.

# Features

- Start a random stretching routine
- Specify the duration and amount of stretches for a routine
- Keep track of time remaining on a specific stretch during a routine
- Receive instructions on the current stretch during a routine

# Technology

## API

- Express
- MongoDB
- Swagger UI
- JWT Authentication (coming soon to front-end)
- Docker for painless deployments
- Azure App Service to deploy API from Docker image

## Client

- TypeScript
- Angular
- Bootstrap

# How to Run Locally

Follow the following steps to run Stretch Auto locally after cloning.

## API

1. Start the Mongo database.

```
docker-compose -f "environment/docker-compose.yml" up -d --build mongo
```

2. Change directory to "api".

```
cd api
```

3. Install packages.

```
npm install
```

4. Create a file named '.env' with the following environment variables. Replace &lt;VALUE&gt; with custom values.

```
MONGO_CONNECTION_STRING=mongodb://super:PASSWORD@localhost:27017/
JWT_SECRET_KEY=<VALUE>
JWT_REFRESH_SECRET_KEY=<VALUE>
ADMIN_USER_EMAIL=admin@stretchauto.com
ADMIN_USER_USERNAME=admin
ADMIN_USER_PASSWORD=<VALUE>
PORT=8000
```

5. Start the application.

```
npm run dev
```

## Client

You **must** start the API first (see above) in order for the Angular client to get data in development.

1. Change directory to "client".

```
cd client
```

2. Install packages.

```
npm install
```

3. Run the application.

```
npm run start
```

# Deployment

It is **strongly recommended** to successfully run the application locally before attempting to deploy. Deployment steps
**do not** describe the creation or configuration of external services, such as Azure or MongoDB.

## API

1. Build the API Docker image and tag the image with the desired Docker repository or Azure Container Registry URI.

```
docker build --pull --rm -f api/Dockerfile -t <DOCKER REPOSITORY OR AZURE CONTAINER REGISTRY URI> api
```

2. Push the tagged Docker image.

```
docker push <DOCKER REPOSITORY OR AZURE CONTAINER REGISTRY URI>
```

3. Run the Docker image as a container via a cloud service, such as Azure App Service or Azure Container Instances.

See the [API release GitHub Action CI/CD workflow](.github/workflows/release-api.yml) for more information on the API deployment.

## Client

1. Change directory to "client".

```
cd client
```

2. Install packages.

```
npm install
```

3. Build the application.

```
npm run build
```

4. Deploy the "dist" folder to a server capable of serving static files.

See the [client release GitHub Action CI/CD workflow](.github/workflows/release-client.yml) for more information on the client deployment.

# Contributing

Please create a new issue if you have any questions, problems, or suggestions. Feel free to open a
pull request if you have a feature or fix you want to contribute to the project.
