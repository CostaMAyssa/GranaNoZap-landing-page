#!/usr/bin/env sh

# abort on errors
set -e

# build
echo "Building application..."
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'grananozap.com.br' > CNAME

# initialize git if not already initialized
git init
git checkout -b gh-pages || git checkout gh-pages
git add -A

# make a commit with current timestamp
git commit -m "deploy: $(date)"

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/CostaMAyssa/GranaNoZap-landing-page.git gh-pages

cd -
echo "Deployment complete"
