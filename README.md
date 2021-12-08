# KARKI - osu api v1 for gulag

This is a simple node js server that emulates the osu v1 api for gulag to enable compatibility with legacy services that still use it.

### Handled Routes:
```
@/                   - done
@/get_beatmaps       - will not be handled, :: gulag does not save enough beatmap data to emulate this endpoint efficiently, you can continue using bancho's v1 endpoint for this.
@/get_user           - done
@/get_scores         - done
@/get_user_best      - done
@/get_user_recent    - done
@/get_match          - will not be handled (?) , gulag does not save matches after they finish.
@/get_replay         - use gulag's built in endpoint
```