const {tree, items} = require('./defaultData');

const Datastore = require('nedb')
const db = {}
// C:\Users\Rishat\AppData\Roaming\Tenjin\db
db.items = new Datastore({ filename: "C:\\Users\\Rishat\\AppData\\Roaming\\Tenjin\\db\\items.db", autoload: true });
db.tree = new Datastore({ filename: "C:\\Users\\Rishat\\AppData\\Roaming\\Tenjin\\db\\tree.db", autoload: true });
db.items.loadDatabase();
db.tree.loadDatabase();

const populateDb = () => {
    db.tree.insert({tree}, (err) => {
        console.log({err})
    });

    db.items.insert({items}, (err, newItems) => {
        console.log({err})
        console.log({newItems})
    })
}

// populateDb();
export const getItems = async () => {
    let data = []
    db.items.find({}, async function(err, docs) {
        // console.log({err})
        console.log("getItems")
        data = docs;
    })
    console.log({data})
}