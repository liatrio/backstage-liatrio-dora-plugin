yarn clean
yarn install
yarn tsc
yarn build
yarn prepack
FN='package.json'
CV=$(jq -r '.version' $FN)
rm backstage-dora-plugin-v$CV.tgz
NV=$(echo "$CV" | awk -F. '{print $1"."$2"."$3+1}')
jq --arg new_version "$NV" '.version = $new_version' "$FN" > tmp.$$.json && mv tmp.$$.json "$FN"
yarn pack
cp backstage-dora-plugin-v$NV.tgz ../liatrio-backstage
FN='../liatrio-backstage/packages/app/package.json'
sed -i '' "s/backstage-dora-plugin-v$CV.tgz/backstage-dora-plugin-v$NV.tgz/" "$FN"
rm ../liatrio-backstage/backstage-dora-plugin-v$CV.tgz
CD=$PWD
cd ../liatrio-backstage
make destroy
make yarn-install-node up