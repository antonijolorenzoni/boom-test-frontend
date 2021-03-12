#!/bin/bash
set -ex

# run this command with 'staging', 'demo' or 'production' as parameter
env=$1

case "$env" in
  "staging")
    sourceLocation=/boom/frontend-stage
    platformTAG=staging
    ;;
  "demo")
    sourceLocation=/boom/frontend-demo
    platformTAG=demo
    ;;
  "production")
    sourceLocation=/boom/frontend-prod   
    version=$(grep "version" $sourceLocation/platform/package.json \
    | head -1 \
    | awk '{gsub("\t", "");print}' \
    | awk '{gsub("version", "");print}' \
    | awk '{gsub(":", "");print}' \
    | awk '{gsub(" ", "");print}' \
    | awk '{gsub(",", "");print}' \
    | awk '{gsub("\"", "");print}')
    echo ".. version is $version"
    platformTAG=$version
    ;;
  *)
    echo ".. you must specify if 'staging', 'demo' or 'production'"
    exit 1
    ;;
esac

cd $sourceLocation

echo ".. building new image with tag $platformTAG"
dockerTarget=platform-frontend:$platformTAG
docker build \
  --no-cache \
  -t $dockerTarget .
  
echo ".. creating extracting container"
docker create --name frontextract $dockerTarget

echo ".. extracting platform static contents"
extractionFolder=/boom/frontend-extraction/$platformTAG
rm -rf $extractionFolder
mkdir -p $extractionFolder
docker cp frontextract:/code/platform/build/. $extractionFolder

echo ".. extracting platform-guest static contents"
extractionFolder=/boom/frontend-extraction/$platformTAG-guest
rm -rf $extractionFolder
mkdir -p $extractionFolder
docker cp frontextract:/code/platform-guest/build/. $extractionFolder

echo ".. deleting extracting container"
docker rm frontextract

if [ "$env" == "production" ] ; then
  echo ".. clean temporary folder"
  tempFolder=/tmp/frontend
  rm -rf $tempFolder
  rm -f /tmp/frontend-$version.zip
  mkdir -p $tempFolder

  echo ".. extracting .zip file"
  docker create --name extract $dockerTarget
  docker cp extract:/code $tempFolder
  docker rm extract
  7z a /tmp/frontend-$platformTAG.zip $tempFolder/code/*

  echo ".. storing .zip to S3 bucket"
  targetFile="/tmp/frontend-$version.zip"
  targetBucket="s3://releases-collection.boomimagestudio.com/frontend/boom-frontend-$version.zip"
  s3cmd put  $targetFile $targetBucket
fi

echo ".. procedure complete! "
exit 0
