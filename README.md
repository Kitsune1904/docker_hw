## Deployment
1. Get all files from this git repository
2. Install docker in your OS
3. Edit in __.docker-env__ variable `MONGO_PASSWORD` password for mongo DB
4. To build all images
```
docker compose --env-file .docker-env build
```
5. To select mode of running containers edit __.docker-env__ variable `NODE_ENV_COMPOSE` use:
   - `prod` - for production container
   - `dev` - for development
   - `test` - to run integration and E2E tests
6. To start containers in selected mode
```
docker compose --env-file .docker-env up
```
### To change mode you DO NOT need to rebuild images!

## Usage
All API for Production and Development will be available on `https://localhost:5001`