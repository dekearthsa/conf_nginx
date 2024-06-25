# To add SSL to your Raspberry Pi web server with Docker, you can use a reverse proxy like Nginx in conjunction with Let's Encrypt for SSL certificates. Here’s a step-by-step guide:

# Step 1: Install Nginx and Certbot
# First, install Nginx and Certbot (Let's Encrypt client) on your Raspberry Pi.

```sh
sudo apt update
sudo apt install nginx
sudo apt install certbot python3-certbot-nginx
``` 

# Step 2: Configure Nginx as a Reverse Proxy
# 1. Create a new Nginx configuration file:
```sh 
sudo nano /etc/nginx/sites-available/my-web-app
``` 

# 2. Add the following configuration to the file:
```sh
server {
    listen 80;
    server_name 192.168.1.100;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
# 3. Enable the configuration:
```sh
sudo ln -s /etc/nginx/sites-available/my-web-app /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

# Step 3: Set Up SSL with Let's Encrypt
# Since Let's Encrypt certificates require a domain name and you are using a local IP address, you can create a self-signed certificate instead.

# 1. Create a self-signed certificate:

```sh 
sudo mkdir /etc/nginx/ssl

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt
```

# 2. Modify the Nginx configuration to include SSL: 

```sh 
sudo nano /etc/nginx/sites-available/my-web-app
```

# 3. Update the configuration:

```sh 
server {
    listen 80;
    server_name 192.168.1.100;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name 192.168.1.100;

    ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
# 4. Test and reload Nginx:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

# Step 5: Access Your Web Application via HTTPS
```sh 
hostname -I

https:/{IPv4}
```