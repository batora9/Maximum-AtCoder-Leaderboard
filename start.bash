# clientとserverの起動を行うスクリプト

# サーバーの起動
cd server
npm start &
cd ..

# クライアントの起動
cd client
npm start
cd ..

# サーバーの停止
kill -9 `ps aux | grep node | grep server | awk '{print $2}'`

# 終了
exit 0