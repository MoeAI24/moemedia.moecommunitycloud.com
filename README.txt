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
   - https://moemedia.moecommunitycloud.com/
   - https://moemedia.moecommunitycloud.com/sitemap.xml
   - https://moemedia.moecommunitycloud.com/robots.txt
5) (Optional) Submit sitemap in Google Search Console

Phase 2 add-ons:
- Mobile hamburger menu
- Real email capture endpoint (Firebase function / Mailchimp)
- Auto-populate video cards from JSON
- Video schema + article schema for each video
