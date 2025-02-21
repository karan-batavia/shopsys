#!/bin/sh

DOCKER_STOREFRONT_REPOSITORY_TAG=$1

docker image build \
    --tag ${DOCKER_STOREFRONT_REPOSITORY_TAG} \
    --target production \
    --no-cache \
    --compress \
    --build-arg node_uid=1000
    -f project-base/storefront/docker/Dockerfile \
    ./project-base/storefront
