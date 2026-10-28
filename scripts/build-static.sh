#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="$project_dir/dist"

rm -rf "$output_dir"
mkdir -p "$output_dir/assets/books" "$output_dir/vendor"
cp "$project_dir/index.html" "$project_dir/styles.css" "$project_dir/script.js" "$project_dir/three-scene.js" "$output_dir/"
cp "$project_dir/googleb2aaa1cd3cc7e80a.html" "$output_dir/"
cp "$project_dir/node_modules/three/build/three.module.js" "$project_dir/node_modules/three/build/three.core.js" "$output_dir/vendor/"
cp "$project_dir"/assets/dashe-books-logo*.png "$output_dir/assets/"
cp "$project_dir"/assets/books/*.webp "$output_dir/assets/books/"

# Book routes and their search metadata are generated after dedicated landing
# pages are copied, so every public URL receives a unique crawlable head.

# Replace the generic quick-view route with the original cinematic landing page.
landing_source="$project_dir/pages/the-man-with-seven-names"
landing_assets="$output_dir/book-pages/the-man-with-seven-names"
mkdir -p "$landing_assets" "$output_dir/the-man-with-seven-names"
cp "$landing_source/landing.css" "$landing_source/landing.js" "$landing_assets/"
cp "$landing_source/index.html" "$output_dir/the-man-with-seven-names.html"
cp "$landing_source/index.html" "$output_dir/the-man-with-seven-names/index.html"

# Publish the original Salt Road cinematic landing page at its DaSHe Books path.
salt_source="$project_dir/pages/the-salt-road-to-lampedusa"
mkdir -p "$output_dir/the-salt-road-to-lampedusa" "$output_dir/assets"
cp "$salt_source/index.html" "$output_dir/the-salt-road-to-lampedusa.html"
cp "$salt_source/index.html" "$output_dir/the-salt-road-to-lampedusa/index.html"
cp "$salt_source"/assets/* "$output_dir/assets/"

# Publish The Border Between Dreams and Death cinematic landing page.
border_source="$project_dir/the-border-between-dreams-and-death"
mkdir -p "$output_dir/the-border-between-dreams-and-death"
cp -R "$border_source"/. "$output_dir/the-border-between-dreams-and-death/"
cp "$border_source/index.html" "$output_dir/the-border-between-dreams-and-death.html"

# Publish the Never Waste a Hello interactive landing page.
hello_source="$project_dir/pages/never-waste-a-hello"
mkdir -p "$output_dir/never-waste-a-hello"
cp -R "$hello_source"/. "$output_dir/never-waste-a-hello/"
cp "$hello_source/index.html" "$output_dir/never-waste-a-hello.html"

node "$project_dir/scripts/generate-seo.mjs"

# The SPA fallback lets future slug-based book pages resolve after they are
# added to the JavaScript catalogue, even before a dedicated route is emitted.
cp "$project_dir/index.html" "$output_dir/404.html"
