# Passwordless Authentication with **tru.ID** PhoneCheck.

## Requirements

- A mobile phone with a SIM card and mobile data connection
- [Node.js](https://nodejs.org)
- [ngrok](https://ngrok.com/)

## Getting Started

Clone the `starter-files` branch via:

```
git clone -b starter-files --single-branch https://github.com/tru-ID/passwordless-auth-phonecheck
```

If you're only interested in the finished code in `main` then run:

```
git clone -b main https://github.com/tru-ID/passwordless-auth-phonecheck.git
```

Create a [tru.ID Account](https://tru.id)

Install the tru.ID CLI via:

```bash
npm i -g @tru_id/cli

```

Input your **tru.ID** credentials which can be found within the tru.ID [console](https://developer.tru.id/console)

Create a new project via:

```bash
tru projects:create passwordless-auth-phonecheck --project-dir .
```


## Starting Project

To start the server first install dependencies via:

```bash
npm install
```

then run

```bash
npm start
```

then run ngrok. In the terminal where ngrok is running, run the following:

```bash
ngrok http 4000
```

this will give you a `https` website e.g.

```bash
https://0d834043fe8d.ngrok.io -> http://localhost:4000
```

To start the mobile application first open up a new terminal and install dependencies via:

```bash
 cd app && npm install
```

then run:

```bash
npm run android
#or
npm run ios
```


## References

- [**tru.ID** docs](https://developer.tru.id/docs)

## Meta

Distributed under the MIT License. See [LICENSE](https://github.com/tru-ID/passwordless-auth-web/blob/main/LICENSE.md)

[**tru.ID**](https://tru.id)
