import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

export default function AppStats() {
    return (
        <CollectionConsumer>
        {
            ({}) => {
                return (
                    <div className="btn-contrast">Loh</div>
                )
            }
        }
        </CollectionConsumer>
    )
}
