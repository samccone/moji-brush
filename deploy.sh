#!/bin/sh
set -e

npm run build
cd dist
git init
git remote add origin git@github.com:samccone/moji-brush.git
git fetch
git add .
git commit -m "🎄 Deploy $(date)"
git checkout gh-pages
git cherry-pick --keep-redundant-commits master
git push
cd ..
rm -rf dist
