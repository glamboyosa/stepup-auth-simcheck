# Step-Up Authentication with SIMCheck.

## Requirements

- A mobile phone with a SIM card and mobile data connection
- [Node.js](https://nodejs.org)
- [ngrok](https://ngrok.com/)
- [Redis](https://redis.io/download)

## Getting Started

Clone the `starter-files` branch via:

```
git clone -b starter-files --single-branch https://github.com/tru-ID/stepup-auth-simcheck
```

If you're only interested in the finished code in `main` then run:

```
git clone -b main https://github.com/tru-ID/stepup-auth-simcheck.git
```

Create a [tru.ID Account](https://tru.id)

Install the tru.ID CLI via:

```bash
npm i -g @tru_id/cli

```

Set up the CLI with the **tru.ID** credentials which can be found within the tru.ID [console](https://developer.tru.id/console).



Create a new project via:

```bash
tru projects:create stepup-auth-simcheck --project-dir .
```


## Starting Project

To start the server first install dependencies via:

```bash
cd server && npm install
```
Ensure Redis is running then run:

```bash
npm start
```

Then run ngrok. In the terminal where ngrok is running, run the following:

```bash
ngrok http 4000
```

This will give you a `https` website e.g.

```bash
https://0d834043fe8d.ngrok.io -> http://localhost:4000
```

To start the mobile application first open up a new terminal and install dependencies via:

```bash
 cd mobile && npm install
```

Then run:

```bash
npm run android
#or
npx pod-install
npm run ios
```


## References

- [**tru.ID** docs](https://developer.tru.id/docs)

## Meta

Distributed under the MIT License. See [LICENSE](https://github.com/tru-ID/passwordless-auth-web/blob/main/LICENSE.md)

[**tru.ID**](https://tru.id)
