# Simple Stream View

The Simple Stream View is creating a RTMP receiver with nginx and is broadcasting it to a simple HTML dashbaord.

### Usage

1) Start the docker container
```bash
docker-compose up -d
```

2) Connect RTMP Sender to `rtmp://localhost:1935/live/recorder`. Hint: In OBS the `Server` is just `rtmp://localhost:1935/live` and the `Stream Key` is `recorder`

3) Start the stream

4) Visit the dashboard under http://localhost:8935 or in VLC Media Player with the url `rtmp://localhost:1935/live/recorder`

