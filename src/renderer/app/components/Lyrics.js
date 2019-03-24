import React from 'react';
import {STATES} from 'common/constants';

const getText = (lyrics, state) => {
    switch(state) {
        case STATES.LOADING:
            return 'Loading...';
        case STATES.LOADED:
            return lyrics
                    .split('\n')
                    .map((item, index) => (
                        <p className='lyrics-text' key={item+index}>{item}</p>
                    ));
        case STATES.NOTING_FOUND:
            return 'Couldn\'t find your song lyrics'
        case STATES.ERROR:
            return 'something went wrong...'
        case STATES.EMPTY:
            return '';
    }
}

const Lyrics = ({lyrics, state}) => {
    return (
        <div
            className='selectable-text'>
            {getText(lyrics, state)}
        </div>
    )
}

export default Lyrics;