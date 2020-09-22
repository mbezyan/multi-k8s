docker build -t mbezyan/multi-client:latest -t mbezyan/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t mbezyan/multi-server:latest -t mbezyan/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t mbezyan/multi-worker:latest -t mbezyan/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push mbezyan/multi-client:latest
docker push mbezyan/multi-server:latest
docker push mbezyan/multi-worker:latest

docker push mbezyan/multi-client:$SHA
docker push mbezyan/multi-server:$SHA
docker push mbezyan/multi-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=mbezyan/multi-client:$SHA
kubectl set image deployments/server-deplyment server=mbezyan/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=mbezyan/multi-worker:$SHA
