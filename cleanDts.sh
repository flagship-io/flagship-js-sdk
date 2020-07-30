# make single .d.ts file
./node_modules/.bin/dts-bundle-generator -o ./dist/index.d.ts ./dist/index.d.ts

buildPath='./dist/'
# delete other *.d.ts files
rm -r "${buildPath}class"
rm -r "${buildPath}config"
rm -r "${buildPath}lib"
rm "${buildPath}types.d.ts"