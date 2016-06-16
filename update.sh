#!/bin/bash

# React needs this for production build
export NODE_ENV=production

# Run Gulp task
gulp build-for-production

# Commit and push
git add .
git commit -m "Update"
git push