docker build -t dct .
docker stop dct || true
docker rm dct || true
docker run -d --name dct -p 3000:3000 dct
