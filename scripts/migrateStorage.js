var admin = require('firebase-admin');
var serviceAccount = require('../serviceAccountFirebase.json');

// Add the Firebase products that you want to use
require('firebase/auth');
require('firebase/storage');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stardew-help.firebaseio.com',
  storageBucket: 'stardew-help.appspot.com',
});

// firebase.initializeApp(firebaseConfig);

(async function run() {
  const storage = admin.storage().bucket();

  try {
    const [res] = await storage.getFiles({ prefix: 'farms' });
    await Promise.all(
      res.map(item => {
        const [folder, name] = item.name.split('/');
        const [id, day, season, year] = name.split('-');
        return storage
          .file(item.name)
          .copy(`${folder}/${id}-${year}-${season}-${day}`);
      })
    );
  } catch (ex) {
    console.error(ex);
  }
})();
