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

export const getItems = async () => await new Promise(resolve => 
    db.items.find({}, function(err, docs) {
        resolve(docs)
    })
)

export const getItem = async (id) => await new Promise(resolve => 
    db.items.find({id: id}, function(err, docs) {
        console.log({docs})
        if (!err)
            resolve(docs[0])
    })
)

export const updateItem = async (id, item) => await new Promise(resolve => 
    db.items.update({id: id}, item)
)

export const insertItem = async (item) => await new Promise(resolve => 
    db.items.insert(item, function(err, newDoc) {
        console.log({newDoc})
    })
)

export const getTree = async () => await new Promise(resolve => 
    db.tree.find({}, function(err, docs) {
        if (!err)
            resolve(docs[0])
    })
)

export const updateTree = async () => await new Promise(resolve => 
    db.tree.update({}, tree)
)

export const putTreeItem = async (id, item) => await new Promise(resolve => 
    db.tree.find({}, function(err, docs) {
        const tree = docs;
        tree.items.id = item
        db.tree.update({}, tree)
    })
)