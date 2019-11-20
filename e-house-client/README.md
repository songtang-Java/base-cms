# backstage-page

## Project setup
```
npm install
```
/root/Public/djej/backApi
/www/server/nginx/conf

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
未开启 进行中 已结束
  0      1       -1
  
开启   结束   null

service
server {
    listen 80;
    server_name 139.129.90.18;
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_set_header Connection "";
        proxy_pass      http://127.0.0.1:8080;
    }
}
  server {
        listen       80;
        server_name  139.129.90.18;

        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        root        /root/Public/djej/client-server/dist;
        location / {
            try_files $uri $uri/ @router;
            index  index.html index.htm;
            proxy_pass http://139.129.90.18:3000;
            proxy_set_header Host $http_host;

        }
        location @router {
            rewrite ^.*$ /index.html last;
        }
  }
server
    {
        listen 80;
        #listen [::]:80;
        server_name 139.129.90.18; #  你的域名不需要加http 
        index index.html index.htm index.php default.html default.htm default.php;
        root   /root/Public/djej/client-server/dist;

        include none.conf;
        #error_page   404   /404.html;
        location /api {
           proxy_pass http://127.0.0.1:3000/; # 当访问v1的时候默认转发到 3000端口
        }

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

        location ~ .*\.(js|css)?$
        {
            expires      12h;
        }

        location ~ /.well-known {
            allow all;
        }

        location ~ /\.
        {
            deny all;
        }

        access_log off;
    }
    
    server {    
        listen 80;    
        server_name  139.129.90.18;    
        root /root/Public/djej/client-server/dist;
        index index.html;
        location ~ ^/favicon\.ico$ {        
            root  /root/Public/djej/client-server/dist;;
        }
            
        location / {        
            try_files $uri $uri/ @fallback;
            index index.html;     
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;   
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for; 
            proxy_set_header   X-Forwarded-Proto  $scheme;
        }
        location @fallback {    
            rewrite ^.*$ /index.html break;
        }   
        access_log  /mnt/logs/nginx/access.log  main;
    }
mongod --dbpath /root/Program/mongo/mongodb/data --fork --logpath /root/Program/mongo/mongodb/log/mongo.log


location / {  

} 


const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
    res.send(html)
})
app.listen(8080);


[Unit] 
   
Description=mongodb  
After=network.target remote-fs.target nss-lookup.target 
   
[Service] 
Type=forking 
ExecStart=/root/Program/mongo/mongodb/bin/mongod --config  /root/Program/mongo/mongodb/etc/mongo.conf
ExecReload=/bin/kill -s HUP $MAINPID 
ExecStop=/root/Program/mongo/mongodb/bin/mongod --shutdown --config  /root/Program/mongo/mongodb/etc/mongo.conf
PrivateTmp=true 
     
[Install] 
WantedBy=multi-user.target 


 server {
        listen 80;
        server_name  139.129.90.18;
        root /root/Public/djej/client-server/dist;
        index index.html;
        location ~ ^/favicon\.ico$ {
            root  /root/Public/djej/client-server/dist;
        }

        location / {
            try_files $uri $uri/ @fallback;
            index index.html;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto  $scheme;
        }
        location @fallback {
            rewrite ^.*$ /index.html break;
        }
         location /api {
                add_header   'Access-Control-Allow-Origin' '*';
                proxy_pass   http://139.129.90.18:3000;
                }
     }
