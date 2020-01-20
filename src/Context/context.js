import React from 'react'

const ProductContext = React.createContext();

export default function context(props) {
    return (
        <ProductContext.Provider value = {{
                
        }}>
            {props.children}
        </ProductContext.Provider>
    )
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};

