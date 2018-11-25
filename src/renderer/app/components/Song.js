import React from 'react';
import {STATES} from 'common/constants';


const getLabel = (song, state) => {
    switch(state) {
        case STATES.LOADING:
            return 'Loading...';
        case STATES.LOADED:
            return <strong>{song}</strong>;
        case STATES.NOTING_FOUND:
        case STATES.ERROR:
            return 'something went wrong...'
        case STATES.EMPTY_STATE:
            return (
                <span>
                    Nothing playing right now. 
                    <p
                        onClick={() => {}}
                        className='blue'>
                        Play?
                    </p>
                </span>
            )
    }
}

const Song = ({song, state}) => {

    return (
        <p>
            {
                getLabel(song, state)
            }
        </p>
    )
}


export default Song;

