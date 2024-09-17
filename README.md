# WAR
This is a simple web design that trys to mimic to working enviorment of a logistics warehouse.
This project uses hexagonal arquitecture with Angular TS as FrontEnd
and a simple backend using Python-Flask with a Mongo database

## Application Deployment and Local Development

To deploy the web application locally, the following initial requirements are needed:
- Python 3.X (version 3.0 or higher)
- Node.js 17.X (version 17.0 or higher)
- MongoDB server with MongoDB Compass

### BackEnd Dependencies Installation

It is recommended to use a virtual environment for installing pip packages. If you obtain the code from GitHub, follow these steps:


#### Virtual Enviorment Creation
```sh
cd BackEnd
python -m venv .env
.env/Scripts/activate
```

#### Python dependencies and Backend Server Start
```sh
pip install -r requirements.txt
py db_scripts.py
py main.py
```

### FrontEnd Dependencies Installation

Dependencies are found in package.json file

#### Angular Dependencies installation
```sh
cd FrontEnd
npm install -g @angular/cli
npm install
```

#### Angular Client Server Start
```sh
ng serve
```


### Documentation for the work in Spanish

```sh
https://docs.google.com/document/d/1PoGNj5yUp1y2j_Wz2L7w8JPny1RIniJGUMIVR-IKoDc/edit?usp=sharing
```
