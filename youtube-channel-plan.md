# YouTube channel plan v2 (2026-11-15)

## Model to replicate
Brand-new faceless channels growing fast right now (per trackers/blogs, unverified):
- Stickman / simple-animation **explainer Shorts** (e.g. Mack, Axen: ~60-90K subs within ~2 months of launch, spring 2026).
- Animated story/horror series with Shorts cut from episodes.
- Pattern: one repeatable template, 60s, hook in first 2s, one fact/story per video, fast cuts, captions, consistent daily posting. Long video -> cut into Shorts.

## Chosen format
**English faceless stickman-style explainers**: "How X actually works", psychology/money/science facts, 30-60s Shorts daily + one 6-10 min long video per week built from the same topics.
- English = higher RPM and bigger audience than local-language.
- Replicate: structure, pacing, hook formulas, thumbnail style. Do NOT copy scripts, footage or exact videos (copyright + "reused content" rejection).

## Monetization bar (verify on YouTube Help Center)
- Early: 500 subs + 3 public uploads/90d + (3,000 hrs OR 3M Shorts views/90d).
- Full: 1,000 subs + (4,000 hrs OR 10M Shorts views).
- Unconfirmed: bar may double Feb 2027. Launch ASAP.

## Weekly loop
1. Research: outlier Shorts in the format, trending topics, hook patterns.
2. Script original videos.
3. Produce: FishAudio voice, generated stickman frames/clips, ffmpeg assembly, captions.
4. Upload via YouTube Data API (private for approval, then public).
5. Analytics API: retention, swipe-away, subs/view. Keep winners, kill losers.
Cadence: 7 Shorts + 1 long-form per week.

## Needed from user
1. YouTube channel + Google Cloud project (YouTube Data + Analytics API) + OAuth refresh token as env secret.
2. Allow youtube.com, i.ytimg.com in network settings.
3. OK to spend FishAudio credits.

## Honest expectations
Sources show typical timelines of 3-12 months; fast cases are anecdotes from vendor blogs. No income guarantee.
