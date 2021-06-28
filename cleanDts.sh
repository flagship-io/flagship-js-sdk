# make single .d.ts file
./node_modules/.bin/dts-bundle-generator -o ./dist/src/index.d.ts ./dist/src/index.d.ts

buildPath='./dist/src/'
# delete other *.d.ts files
rm -r "${buildPath}class"
rm -r "${buildPath}config"
rm -r "${buildPath}lib"
rm "${buildPath}types.d.ts"