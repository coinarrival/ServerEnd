# ServerEnd

![build](https://travis-ci.org/coinarrival/ServerEnd.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/coinarrival/ServerEnd/badge.svg?branch=master)](https://coveralls.io/github/coinarrival/ServerEnd?branch=master)

Server-end project for Coin Arrival

## Dependency

- Docker familiar User

  |Docker|
  |:----:|
  |>=18.03.0ce|

- Docker Unfamiliar User

  |node|npm|
  |:--:|:-:|
  |>=v9.0|>=v6.0|

## Usage

### API Reference

[API-Document](https://coinarrival.github.io/documents/docs/design/serverendAPI.html)

### Development

本项目依赖于[CoinArrival/BackEnd](https://github.com/coinarrival/BackEnd)，故介绍从 BackEnd 到 ServerEnd 的部署流程。

#### With Docker

- BackEnd

  BackEnd 可以从 docker hub 拉取(~~其实我们也没成功push上去~~):
  ```bash
  docker pull sysucoinarrival/backend_backend:latest
  ```

  鉴于国内网速，建议采用下列方式:

  - Clone BackEnd Repo
  
    ```bash
    git clone https://github.com/coinarrival/BackEnd.git
    cd BackEnd
    ```
  
  - 修改数据库配置文件`BackEnd/settings.py`:

    ```python
    DATABASES = {
      'default': {
        # ...
        'HOST': 'coin_arrival',  # 与本项目下 docker-compose 中的数据库服务容器名保持一致
      }
    }
    ```
  - 创建 BackEnd Docker 镜像

    ```bash
    # pwd: /path/BackEnd
    docker-compose build .
    ```
  
- 运行项目

  首先，下载源代码

  ```bash
  git clone https://github.com/coinarrival/ServerEnd.git
  cd ServerEnd
  ```

  为适应多样的部署方法，需要先修改配置文件`bin/config/config.js`

  ```javascript
  'backend': 'http://backend:8000', // backend 为本项目 docker-compose 中的后台服务名
  ```

  下面可以正常运行项目：
  ```bash
  # running foreground
  docker-compose up # if with -d param it runs background
  ```

  通过 `curl` 可以测试项目是否正常运行：
  ```bash
  curl http://localhost:3000/registration -X POST -d "username=testuser&password=12345678&email=test@test.com&phone=13712345678&role=student"
  # success response data below
  # {"status_code":201}
  ```

#### Manually

手动进行部署也是可以的。

- 启动数据库服务支持(MySQL5.7)

  创建所需数据库
  ```bash
  CREATE DATABASE coin_arrival;
  ```

  数据库中使用 `show databases;` 出现 `coin_arrival` 则创建成功

- BackEnd 启动

  ```bash
  git clone https://github.com/coinarrival/BackEnd.git
  cd BackEnd
  ```
  
  通过修改 `BackEnd/settings.py` 中的数据库配置来帮助后台项目连接你所使用的数据库

    ```python
    DATABASES = {
      'default': {
        'ENGINE': 'django.db.backends.mysql',   # 数据库引擎
        'NAME': 'coin_arrival',  # 与前一步的数据库名保持一致
        'USER': 'zhangshanfeng',     # 用户名，可以自己创建用户
        'PASSWORD': '******',  # 密码
        'HOST': '127.0.0.1',  # mysql服务所在的主机ip
        'PORT': '3306',         # mysql服务端口
      }
    }
    ```

  ```bash
  python ./BackEnd/manage.py migrate
  python ./BackEnd/manage.py makemigrations
  python ./BackEnd/manage.py runserver 0.0.0.0:8000
  ```

  后台程序无报错则启动完毕，如果有，请审查你的数据库配置是否正确。

- ServerEnd 启动

  首先下载项目源码并安装项目依赖

  ```bash
  git clone https://github.com/coinarrival/ServerEnd.git
  cd ServerEnd
  npm install
  ```

  然后可以启动服务端项目：
  
  ```bash
  npm start
  ```

  通过 `curl` 可以测试项目是否正常运行：
  
  ```bash
  curl http://localhost:3000/registration -X POST -d "username=testuser&password=12345678&email=test@test.com&phone=13712345678&role=student"
  # success response data below
  # {"status_code":201}
  ```

  *对于开发人员，项目提供了热更新启动命令：`npm run dev`。每当你对`bin`目录下的源代码文件进行了修改，项目会自动重启，而不必手动关闭后再启动*。

## Q&A

Waiting...