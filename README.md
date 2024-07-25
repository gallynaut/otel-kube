# OpenTelemetry Minikube Demo

Just sandboxing running minikube locally

## Setup

Make sure Docker is running locally, then run the following to install Minikube
and configure kubectl to connect to our local instance:

```bash
brew install kubectl
brew install minikube

```

I've been using [Podman](https://podman.io/docs/installation) as my container
runtime instead of Docker - idk why.

## Commands

### Start Minikube

Start MiniKube with Docker, or use Podman instead. For some reason I need to
specify the containerd runtime to get it working.

```bash
minikube start --driver=docker --container-runtime=containerd
# to use podman instead of docker
minikube start --driver=podman
```

**IMPORTANT**

You should run `minikube tunnel` in a new shell so your localhost ports are
tunneled to Minikube for running test scripts.

You can also open a local Kubernetes UI with the command `minikube dashboard` in
a new shell. But learning the commands is recommended.

### Deploy

Run the following to deploy the OpenTelemetry Helm charts.

```bash
kubectl apply -f ./charts
```

### Config

To set the opentelemetry namespace as the default:

```bash
kubectl config set-context --current --namespace=opentelemetry
```

### View Logs

The following command will output the list of pods, grep the Pod where the name
starts with 'otel-collector' (where the pod name is derived from
<Service.name>-<random-hex-string>). Then call `kubectl logs -f <PodName>` to
follow the containers log stream.

```bash
kubectl logs -f `kubectl get pods | awk '/otel-collector/ {print $1}'`
```

### Delete a Pod

When you delete a Pod in kubernetes, it will be recreated by the scheduler.

Our deployment uses a ConfigMap which stores the OTel yaml config so it can be
mounted to the container on startup. If you only update this configmap, then you
will need to delete the Pod manually. There are ways around it but havent gotten
to it.

```bash
kubectl delete pod `kubectl get pods | awk '/otel-collector/ {print $1}'`
```