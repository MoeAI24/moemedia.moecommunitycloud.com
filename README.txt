MoeMedia Subdomain Package (moemedia.moecommunitycloud.com)

Folder structure (upload the CONTENTS of this folder to the *subdomain root*):
/
  index.html
  news.html
  ai-tech.html
  sports.html
  satire.html
  shorts.html
  live.html
  members.html
  join.html
  shop.html
  video.html
  about.html
  advertise.html
  ethics.html
  privacy.html
  404.html
  robots.txt
  sitemap.xml
  assets/
    css/media.css
    js/media.js
    img/moemedia-logo.svg

Important:
- CSS/JS are linked with absolute paths (/assets/...) so they resolve correctly when deployed to the SUBDOMAIN ROOT.
- If you deploy inside a subfolder (not recommended), change links to relative paths.

Repo suggestion:
- Create a dedicated repo like: moemedia-subdomain
- Or a folder in your existing web repo: /moemedia/

Quick deploy checklist:
1) Create DNS record: moemedia -> your hosting target
2) Enable HTTPS
3) Upload files to subdomain root
4) Verify:

Video SEO (VideoObject + Key Moments):
- video.html emits VideoObject JSON-LD when you provide a real upload date.
- Recommended link pattern (best results):

  /video.html?v=YOUTUBE_ID&t=TITLE&d=DESC&c=NEWS&u=YYYY-MM-DD&dur=PT12M44S

  Params:
    v   = YouTube video id (required)
    t   = Title (recommended)
    d   = Description (recommended)
    c   = Category tag (optional)
    u   = Upload date in YYYY-MM-DD (IMPORTANT: schema is only emitted if this is provided)
    dur = Duration (ISO 8601, e.g., PT12M44S) (optional)

Key Moments:
- Automatic key moments: supported via SeekToAction URL template.
- Manual clips (optional): add up to 8 chapter clips with:

    km1=Label~start~end
    km2=Label~start~end

  Example:
    /video.html?v=YOUTUBE_ID&t=...&u=2026-01-15&km1=Intro~0~45&km2=Receipts~45~120

- Deep link to a timestamp:
    /video.html?v=YOUTUBE_ID&ts=90

Verify (after deploy):
  - https://moemedia.moecommunitycloud.com/
  - https://moemedia.moecommunitycloud.com/sitemap.xml
  - https://moemedia.moecommunitycloud.com/robots.txt

5) (Optional) Submit sitemap in Google Search Console

Phase 2 add-ons:
- Mobile hamburger menu
- Real email capture endpoint (Firebase function / Mailchimp)
- Auto-populate video cards from JSON
- Video schema + article schema for each video
