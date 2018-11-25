import React, { Component } from 'react';
import axios from 'axios';
import {SpotifyApplicationClient as spotify} from 'spotify-application-client';
import Song from './components/Song';
import Lyrics from './components/Lyrics';
import { get } from 'common/services/api';
import { STATES, API_KEY } from 'common/constants';
import './main.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: '',
      songState: STATES.LOADING,
      lyrics: '',
      lyricsState: STATES.EMPTY
    };

  }

  async getLyrics(artist, track) {
    try{
        this.setState({ lyricsState: STATES.LOADING });
        const { result } = await get(`/${artist}/${track}?apikey=${API_KEY}`)
        const lyrics = result.track.text;
        if(lyrics) {
            this.setState({ lyrics, lyricsState: STATES.LOADED });
        } else {
            this.setState({ lyrics, lyricsState: STATES.NOTING_FOUND });
        }
        
    } catch(e) {
        console.error('Api error:', e);
        this.setState({ lyricsState: STATES.ERROR });
    }
  }

  async init() {
    try {
        const [artist, track] = await Promise.all([
            spotify.getArtistName(), 
            spotify.getTrackName()
        ]);
        this.setState({song: `${track} by ${artist}`, songState: STATES.LOADED});
        this.getLyrics(artist, track);
    } catch(e) {
        console.error('Spotify error:', e);
        this.setState({ songState: STATES.ERROR });
    }
  }

  componentDidMount() {
    this.init();
  }

  render() {
    const {
        song, 
        lyrics,
        songState,
        lyricsState
    } = this.state;

    return (
        <div
        className='window'>
            <strong
                onClick={() => {
                this.init();
                }}>
                RELOAD
            </strong>
            <div
                className='scrollable'>
                <Song
                    {...{song, state: songState }}/>
                <Lyrics
                    {...{lyrics, state: lyricsState }}/>
            </div>
        </div>
    )
  }
}

export default App;
