# Xendit Payment Application Guide Local Setup
---

## Nodejs installation:

Follow the instruction in the link below:

https://nodejs.org/en/download/package-manager


## Clone the application in repository:
```bash
git clone https://github.com/JellaDivinaTolentino/xendit-api.git
```


## Running the application:

### Run the development server in Front End:
1. Go to front end directory
```bash
cd smf-xendit-fe
```
2. Run ```npm install```
3. Run the script
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run the API (Back End):

1. Go to back end directory
```bash
cd sfm-xendit-be
```
2. Run ```npm install```
3. Run the script
```bash
nodemon server.js
```
## Updating config in the application:
### Front End:
1. Open file ```config.js```.
2. Update ```apiUrl``` eg. ```http://localhost:3000``` for API url.
3. Update ```successReturnUrl``` for success redirection of payment.
4. Update ```failureReturnUrl``` for failed redirection of payment.
5. Run the script
```bash
npm run dev
```
### Back End:
1. Open file ```.env```.
2. Update ```XENDIT_API_KEY``` for API key.
3. Update ```XENDIT_WEB_HOOK_TOKEN``` for web hook token.
4. Run the script
```bash
nodemon server.js
```


