import React from 'react'


const Collection = React.createContext();

export default function CollectionProvider(props) {
    return (
        <Collection.Provider value = {{
                
        }}>
            {props.children}
        </Collection.Provider>
    )
}

const CollectionConsumer = Collection.Consumer;

export {CollectionProvider, CollectionConsumer};

