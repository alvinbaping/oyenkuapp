# YouTube channel plan (draft, 2026-11-15)

## Recommended niche
**Personal finance, Indonesian language, faceless** (Shorts + weekly long-form).
- Why: finance has the highest breakout rate in the research (OutlierKit: 16.7% of videos beat the channel average 10x), high RPM, and it fits the Oyenku app (soft promo, no ad-policy conflict).
- Risk: Indonesian RPM is much lower than US. Approval is about views, so Shorts do the growth and long-form does the earning.
- Alternative for higher RPM: English finance/AI-tools explainers (more competition).

## Monetization bar (verify on YouTube Help Center)
- Early tier: 500 subs + 3 public uploads in 90 days + (3,000 watch hrs OR 3M Shorts views / 90 days). Fan funding only.
- Full ads: 1,000 subs + (4,000 hrs OR 10M Shorts views).
- UNCONFIRMED: sources say the bar may double from Feb 2027 for new channels (8,000 hrs / 20M Shorts views). Launch ASAP in case it's true.

## Weekly loop
1. Research: trending finance topics, outlier videos in the niche.
2. Script original videos (inspired by topics, never copied footage or scripts).
3. Produce: FishAudio voice, AI images/clips, ffmpeg assembly, captions.
4. Upload via YouTube Data API (private first, you approve, then public).
5. Review: YouTube Analytics API (retention, CTR, subs per view). Double down on winners.
Cadence: 5 Shorts + 1 long-form per week.

## Needed from you
1. Create a YouTube channel.
2. Google Cloud project with YouTube Data API v3 + YouTube Analytics API enabled, and an OAuth client. Complete one consent flow and give me the refresh token as an environment secret.
3. Allow youtube.com, i.ytimg.com and ppc.land in the session network settings (googleapis.com already works).
4. Approve AI voice/video credit spend (FishAudio).

## Hard rules
- No reuploading or remaking others' videos: it triggers copyright strikes and the "reused/mass-produced content" rejection.
- Disclose realistic AI-generated content in upload settings.
- No income guarantee.
