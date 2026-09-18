# Sprout — Landing Page

Landing page สินค้าสมมติ **Sprout** (แอปการเงิน/ออมเงินอัตโนมัติ)
ออกแบบตามหลัก **UX/UI + จิตวิทยาการโน้มน้าว** เพื่อการแปลงเป็นลูกค้า (conversion)
เขียนด้วย **HTML + CSS + JavaScript ล้วน ไม่มี dependency ภายนอก** ไม่ต้อง build

![type](https://img.shields.io/badge/stack-vanilla-10b981) ![deps](https://img.shields.io/badge/dependencies-0-34d399)

## 🧠 หลักจิตวิทยา / UX ที่ใส่ไว้

| หลักการ | อยู่ตรงไหน |
|---|---|
| Value เป็นประโยชน์ (ไม่ใช่ฟีเจอร์) + ลด friction | Hero: "ออมเงินอัตโนมัติ" + "เริ่มฟรี ไม่ต้องผูกบัตร" |
| Social proof | เรตติ้ง/จำนวนผู้ใช้ใน hero, แถบมาตรฐาน, ตัวเลขสถิติ, รีวิว |
| Authority / trust | แถบ PDPA · ISO 27001 · SSL, หัวข้อความปลอดภัย |
| Problem → Agitate → Solve | ส่วน "เก็บเงินไม่เคยอยู่" ก่อนเสนอทางแก้ |
| ลดความรู้สึกยุ่งยาก | "เริ่มออมได้ใน 3 นาที" (3 ขั้น) |
| Pricing anchoring + decoy | 3 แพ็กเกจ, ตัวกลาง "แนะนำ" เด่น |
| Risk reversal | การันตีคืนเงิน 30 วัน · ยกเลิกได้ทุกเมื่อ |
| Objection handling | FAQ ตอบข้อกังวลเรื่องความปลอดภัย/ค่าธรรมเนียม/ยกเลิก |
| CTA ซ้ำย้ำ | ปุ่ม "เริ่มใช้ฟรี" ตั้งแต่ nav → hero → showcase → pricing → ปิดท้าย |

## ✨ ฟีเจอร์เชิงเทคนิค

- **โหมดสว่าง/มืด (Light/Dark)** — สลับได้เอง เคารพ system preference ตอนแรก จำค่าไว้ใน localStorage และตั้งก่อน paint (`theme-init.js`) เพื่อกัน flash
- **สลับภาษา TH/EN** — คำแปลเก็บเป็น dictionary ใน JS สลับด้วย `textContent` (ไม่ใช้ innerHTML) จำภาษาไว้ใน localStorage
- **Reveal-on-scroll** (`IntersectionObserver`), **count-up** ตัวเลข (รองรับทศนิยม เช่น 4.9)
- **กราฟแดชบอร์ดโตเมื่อเลื่อนถึง**, เส้นกราฟ hero วาดเอง (SVG stroke animation)
- **สลับราคา รายเดือน/รายปี** และ **FAQ accordion** (เปิดทีละอัน)
- ตัวการ์ด UI ของแอป + ไอคอนทั้งหมดสร้างจาก **CSS/SVG** — ไม่มีไฟล์รูป โหลดไว
- ทันสมัย: ธีมสว่างสะอาด สลับ section มืดเพื่อความพรีเมียม (fintech look)
- **เข้าถึงง่าย + ปลอดภัย**: semantic HTML, `prefers-reduced-motion`, skip link, โฟกัสชัด,
  **Content Security Policy** เข้ม, ไม่มี `innerHTML`/`eval` (ไม่มีช่องทาง XSS)

## 📁 โครงสร้าง

```
fastwork/
├─ index.html     # โครงหน้า + เนื้อหา (semantic) + data-i18n
├─ styles.css     # ดีไซน์ + ธีมสว่าง/มืด + คอมโพเนนต์ + responsive
├─ theme-init.js  # เซ็ตธีม/ภาษาก่อน paint (กัน flash) — โหลดใน <head>
├─ script.js      # reveal, count-up, chart, pricing toggle, FAQ, theme, i18n
├─ favicon.svg    # โลโก้
├─ _headers       # security headers ตอน deploy (Netlify/Cloudflare)
└─ README.md
```

## ▶️ รันในเครื่อง

```bash
python -m http.server 5173      # แล้วเปิด http://localhost:5173
# หรือ
npx serve .
```

## 🚀 Deploy ฟรี (แนะนำ)

| บริการ | วิธีเร็วสุด |
|---|---|
| **Netlify** | ลากโฟลเดอร์ทั้งอันไปวางที่ https://app.netlify.com/drop (อ่าน `_headers` ให้อัตโนมัติ) |
| **Cloudflare Pages** | เชื่อม GitHub หรืออัปโหลดโฟลเดอร์ — เครือข่ายเร็ว โดเมนฟรี |
| **Vercel** | `npx vercel` ในโฟลเดอร์ |
| **GitHub Pages** | push ขึ้น repo → Settings → Pages → เลือก branch |

**เร็วสุด (แบบ manual):** เปิด https://app.netlify.com/drop แล้วลากโฟลเดอร์ `fastwork` ไปวาง ได้ลิงก์ HTTPS ใน ~10 วินาที

## 🔁 CI/CD

- **CI — GitHub Actions** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): ทุก push/PR รัน **HTMLHint** เป็น quality gate
- **CD — Netlify (เชื่อม GitHub ตรง ๆ)**: push เข้า `main` → deploy **production**, เปิด PR → **deploy preview** อัตโนมัติ — **ไม่ต้องเก็บ token/secret** (ปลอดภัยกว่า)

### เชื่อม Netlify กับ GitHub (ตั้งครั้งเดียว)
1. [app.netlify.com](https://app.netlify.com) → **Add new project → Import an existing project → GitHub**
2. อนุญาตสิทธิ์ (เลือกให้เห็นเฉพาะ repo `sprout-landing` ก็ได้ — least privilege)
3. Build settings: **Build command** เว้นว่าง · **Publish directory** = `.` (มีใน `netlify.toml` อยู่แล้ว)
4. กด **Deploy** — เสร็จ! จากนั้น push เข้า `main` = deploy อัตโนมัติ, เปิด PR = ได้ลิงก์พรีวิว

> ทำไมไม่ deploy ผ่าน GitHub Actions? เพราะแบบนั้นต้องเก็บ Netlify token เป็น secret ใน GitHub — การให้ Netlify เชื่อม GitHub ตรง ๆ ปลอดภัยกว่า (ไม่มี long-lived token) และได้ PR preview ในตัว ส่วน Actions ทำหน้าที่ CI ตรวจคุณภาพโค้ดก่อน merge

## 🔧 ปรับแต่ง

- **ธีม/สี**: ตัวแปรใน `:root` ของ `styles.css` (`--brand`, `--ink`, ฯลฯ)
- **ฟอนต์**: ปัจจุบันใช้ **Prompt** (หัวข้อ) + **IBM Plex Sans Thai** (เนื้อหา) — รองรับไทย/อังกฤษในตัว เปลี่ยนได้ที่ลิงก์ Google Fonts ใน `index.html` และตัวแปร `--font-head` / `--font` ใน `styles.css`
- **ราคา**: แก้ `data-monthly` / `data-yearly` บน `.amount` ใน `index.html`
- **เนื้อหา**: แก้ใน `index.html` ได้ตรง ๆ

---

> งานสาธิตเพื่อการนำเสนอผลงาน — ชื่อแบรนด์ ราคา และข้อมูลเป็นตัวอย่างสมมติ
