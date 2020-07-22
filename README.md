# property-comparison

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```


## firebase initialization & deploy
- Qiita
  - https://qiita.com/ririli/items/d0d3a6ae78c1b6e827fc
- create firebase keys file to plugin dir
```javascript
import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
        apiKey: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        authDomain: "xxxxxxxxxxxxxxxx.firebaseapp.com",
        databaseURL: "https://xxxxxxxxxxxxxxxx.firebaseio.com",
        projectId: "xxxxxxxxxxxxxxxx",
        storageBucket: "xxxxxxxxxxxxxxxx.appspot.com",
        messagingSenderId: "xxxxxxxxxxxxx",
        appId: "x:xxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxx"
    }
  )
}

export default firebase
```
- commands
```bash
$ npm install --save firebase
$ npm install -g firebase-tools
$ firebase login
$ firebase init
$ firebase deploy
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
