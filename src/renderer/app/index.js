import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import axios from 'axios';
import {SpotifyApplicationClient as spotify} from 'spotify-application-client';
import Song from './components/Song';
import Lyrics from './components/Lyrics';
import { get } from 'common/services/api';
import { STATES, API_KEY } from 'common/constants';
import './main.css';

let interval;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: '',
      artist: '',
      track: '',
      songState: STATES.LOADING,
      lyrics: '',
      lyricsState: STATES.EMPTY
    };

  }

  async getLyrics(artist, track) {
    try{
        console.log('searching for lyrics')
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

  componentDidUpdate(prevProps, prevState) {
        const { song, artist, track } = this.state;

        if(this.state.song !== prevState.song) {
            this.getLyrics(artist, track);
        }
  }

  async init() {
    try {
        console.log('init')
        const [artist, track] = await Promise.all([
            spotify.getArtistName(), 
            spotify.getTrackName()
        ]);
        
        this.setState((state) => {
            const song = `${track} by ${artist}`;

            if(state.song !== song) {
                return ({ song, artist, track, songState: STATES.LOADED })
            }
        });
    } catch(e) {
        console.error('Spotify error:', e);
        this.setState({ songState: STATES.ERROR });
    }
  }

  componentDidMount() {
    ipcRenderer.on('open', () => {
        console.log('open')
        this.init();
        interval = setInterval(() => {
            this.init();
        }, 2000)
    });
    ipcRenderer.on('close', () => {
        clearInterval(interval);
        console.log('close')
    });
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
        <div>
            <div
                className='window'>
                <header className="toolbar toolbar-header">
                    <h1 className="title">Lyrify</h1>
                    <span
                        className='quit'
                        onClick={() => { ipcRenderer.send('quit') }}>
                        quit
                    </span>
                </header>
                <div className="window-content">
                    <div className="pane pane-content">
                        <Song
                            {...{song, state: songState }}/>
                        <Lyrics
                            {...{lyrics, state: lyricsState }}/>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default App;
