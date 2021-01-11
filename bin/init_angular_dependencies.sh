# Setup Angular dependencies with NPM
apk add --no-cache git && apk add python3 g++ make && rm -rf /var/cache/apk/*
npm ci --unsafe-perm=true --allow-root
# Echo versions
export PATH=/opt/atlassian/pipelines/agent/build/node_modules/.bin:$PATH
NG_VERSION=$(ng --version)
echo "NG_VERSION $NG_VERSION"
