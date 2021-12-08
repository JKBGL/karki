# KARKI - osu api v1 for gulag

This is a simple node js server that emulates the osu v1 api for gulag to enable compatibility with legacy services that still use it.

### How to run:
#### Requirements:
- Gulag db running on MySQL 8.0+
- Node.JS

#### Required packages
```
npm install express express-rate-limit mysql8 util 
```
#### Remember to set up the config before running!
```sh
> cp ext/config_sample.js config.js
> nano config.js
```
#### Startup Commands:
```sh
# Using the included script:
> ./sausage.sh

# Using node directly:
> node init.js
```

### Handled Routes:
```css
@/                   - done
@/get_beatmaps       - will not be handled, :: gulag does not save enough beatmap data to
emulate this endpoint efficiently, you can continue using bancho's v1 endpoint for this.
@/get_user           - done
@/get_scores         - done
@/get_user_best      - done
@/get_user_recent    - done
@/get_match          - will not be handled (?) , gulag does not save matches after they finish.
@/get_replay         - use gulag's built in endpoint
```

\- from Jakatebel with ♥
