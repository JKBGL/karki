# KARKI - osu api v1 for gulag

This is a simple node js server that emulates the osu v1 api for gulag to enable compatibility with legacy services that still use it.

### How to run:
#### Requirements:
- Gulag db running on MySQL 8.0+
- Node.JS >= 14


#### Remember to install requiremenets and set up the config before running!
```sh
> npm install
> cp ext/config_sample.js config.js
> nano config.js
```
#### Startup Commands:
```sh
# Using the included script:
> ./sausage.sh

# Using npm to start:
> npm start
# or run directly:
> node init.js
```

### Handled Routes:
```css
@/                   - done
@/get_beatmaps       - added proxy, use `k-overwrite` if you need two seprate api key for gulag and proxy destination.
@/get_user           - done
@/get_scores         - done
@/get_user_best      - done
@/get_user_recent    - done
@/get_match          - will not be handled (?) , gulag does not save matches after they finish.
@/get_replay         - use gulag's built in endpoint
```
### extended parameters
#### api key overwritting `k-overwrite`
if api-key are required in both gulag and your apiv1 proxy target, use `k-overwrite` to pass `k` to proxied server
#### mode `m`
|--|--|--|--|mode|
|:--:|:--:|:--:|:--:|:--|
0 | 1 | 2 | 3 |`vanilla`
4 | 5 | 6 | 7 |`Relax`
8 | | | | `AP`

\- from Jakatebel with ♥
