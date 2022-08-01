

## using Api Query Params in the query string
### Querying data using the query string
default skip limit operators are 'skip' and 'limit'
aqp('skip=5&limit=10');
could map to page and size

### projection 
default is `fields`
`aqp('fields=id,url');`

### sort
- default operator is `sort`
- accepts comma separated list of field names
- use `-` to indicate descending order
- `aqp('sort=-points,createdAt');`

### search expertise using an "OR" query
- can use comma separated list
- `expertise=aws,rust`

### search expertise using an AND (a.k.a $all)
- must use the `filter` key to specify the search criteria
- you can the use most of the more advanced mongodb query operations
- `GET http://localhost:8181/coaches?filter={ "expertise": { "$all": [ "html", "css" ] } }`

### get at most 5 couch documents
`/coaches?limit=5`



# Starting a local mongodb on docker

## option 1 start your own local container
- use the following docker command to start a mongodb:4.4.6 image with a "root" user and password: "password"
> docker run -d --name mongo-dev -p 27017-27019:27017-27019 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=password mongo:4.4.6

- connect directly to the container with a bash terminal:
> docker exec -it mongo-dev bash

- you can then use the `mongo` command to interact with mongo shell



## option 2 use provided docker-compose script
- you can use the provided docker-compose.yml to start a mongodb container
- the advantage of this, is that it will create the findACoachDB and pre-load it with dummy data.
- it does this by mounting `init-findacoach.sh`, as a volume, into the mondo-db container. Which will
  trigger mongodb to pre-load the dummy data at start up.
- make sure you have docker-compose installed
- `docker-compose up [-d]` to start mongodb container
- `docker-compose down` to bring down the container