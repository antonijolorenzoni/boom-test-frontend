#!/bin/bash

# exit if any error occurs
set -e

# get a string version in input and break it down 
version=$1

regex="([0-9]+).([0-9]+).([0-9]+)"
if [[ $version =~ $regex ]]; then
  major="${BASH_REMATCH[1]}"
  minor="${BASH_REMATCH[2]}"
  patch="${BASH_REMATCH[3]}"
else 
  echo "  !! Version $1 is not well formed !!  "
  exit 1
fi


############# Start merge on master ##################
git flow release start $version 

export GIT_MERGE_AUTOEDIT=no
git flow release finish -m "$version" -T "$version" $version 
unset GIT_MERGE_AUTOEDIT

git push origin --all
git push origin --tags


############# Start bump version on Develop ##################

# calculate new version
bump=$(expr $minor + 1)

newPackageVersion="$major.$bump.0"
sedCommand="sed -i '3s/version\": \".*/version\": \"$newPackageVersion\",/' platform/package.json"
echo "$sedCommand"
eval $sedCommand

echo ".. Updating develop branch to $newversion"
git add .
git commit -am "Update Develop to new version $newversion"
git push origin --all

echo ".. merge procedure complete!"
exit 0