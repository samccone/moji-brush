#!/bin/sh
set -e

npm run build
cd dist
git init --initial-branch=master
git remote add origin git@github.com:samccone/moji-brush.git
git fetch
git add .
git commit -m "🎄 Deploy $(date)"
git checkout gh-pages
git cherry-pick master --keep-redundant-commits --strategy-option theirs
git push --set-upstream origin gh-pages
cd ..
rm -rf dist
