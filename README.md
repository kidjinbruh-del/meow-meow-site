# meow meow записи — лендинг

Одностраничный сайт приложения для мастера по ремонту бытовой техники.
Статический HTML/CSS/JS: без сборки, фреймворков и внешних запросов — шрифты
и скриншоты лежат рядом.

**Живая версия:** https://kidjinbruh-del.github.io/meow-meow-site/

**Что на странице:** оффер и кнопка скачивания APK, преимущества, три шага работы,
галерея реальных экранов с лайтбоксом, блок про приватность и SQLite, FAQ,
финальный CTA с SHA-256 и ссылками на GitHub.

## Структура

```
meow-site/
├─ index.html                 вся разметка и тексты
├─ assets/
│  ├─ css/fonts.css           локальные @font-face (Golos Text, JetBrains Mono)
│  ├─ css/style.css           дизайн-система и адаптив
│  ├─ js/main.js              меню, появление блоков, лайтбокс, копирование SHA
│  ├─ fonts/*.woff2           сабсеты cyrillic / latin / latin-ext
│  └─ img/                    скриншоты приложения и OG-картинка
├─ tools/
│  ├─ fetch_fonts.py          перекачивает шрифты и собирает fonts.css
│  └─ og.html                 макет OG-картинки 1200×630
└─ README.md
```

## Локальный просмотр

```bash
cd meow-site
python -m http.server 4173
```

Откройте `http://127.0.0.1:4173/`. Через `file://` тоже работает, но тогда
не сработает `navigator.clipboard` для кнопки копирования SHA.

## Что и где править

| Задача | Файл |
| --- | --- |
| Тексты, порядок секций, ссылки | `index.html` |
| Цвета, типографика, отступы | `assets/css/style.css`, блок `:root` |
| Анимация появления, меню, лайтбокс | `assets/js/main.js` |
| Скриншоты | `assets/img/screen-*.png` |
| OG-картинка | `tools/og.html` → скриншот 1200×630 в `assets/img/og.png` |

**При выпуске новой версии приложения** обновите в `index.html`:

- ссылки на APK (`releases/latest/download/meow-meow-zapisi-1.0.apk`);
- версию и размер в hero и в блоке загрузки;
- SHA-256 в тексте и в `data-copy` у кнопки;
- при необходимости — ссылку на заметки релиза.

## Публикация

Сайт развёрнут на GitHub Pages:

- репозиторий: `meow-meow-site`;
- источник: ветка `main`, папка `/ (root)`;
- файл `.nojekyll` отключает обработку Jekyll — сайт отдаётся как есть;
- адрес: https://kidjinbruh-del.github.io/meow-meow-site/.

Обновление — обычный push в `main`, Pages пересобирает сайт автоматически.
Статус сборки:

```bash
gh api repos/kidjinbruh-del/meow-meow-site/pages --jq '.status, .html_url'
```

### Если делать с нуля

```bash
cd meow-site
git init -b main
git add .
git commit -m "feat: landing page"
gh repo create meow-meow-site --public --source=. --remote=origin --push
```

Затем **Settings → Pages → Build and deployment → Deploy from a branch**:
ветка `main`, папка `/ (root)`. Сайт будет доступен по адресу
`https://<username>.github.io/meow-meow-site/`.

Так как сайт живёт в подпапке, все пути в проекте относительные — менять ничего
не нужно. Если позже понадобится деплой из папки `site/` репозитория приложения,
используйте официальный шаблон Pages: **Settings → Pages → GitHub Actions →
Static HTML** (GitHub сам создаст нужный workflow).

### Перед публикацией

1. Проверьте, что `og:url`, `og:image`, `twitter:image` и `canonical` указывают
   на реальный адрес сайта (сейчас — `https://kidjinbruh-del.github.io/meow-meow-site/`).
2. Убедитесь, что ссылки на APK ведут на актуальный релиз.
3. Прогоните страницу через Lighthouse (Performance / Accessibility / SEO).

## Проверки

Страница проверена в Chromium (Playwright):

- нет ошибок консоли и упавших запросов;
- нет горизонтального переполнения на 360, 390, 768, 1024 и 1440 px;
- шрифты загружаются локально (`document.fonts.status === "loaded"`);
- мобильное меню открывается, `aria-expanded` меняется, иконка меняется на крестик;
- лайтбокс открывается по клику, листается стрелками, закрывается по `Esc`,
  блокирует прокрутку страницы;
- кнопка копирования SHA-256 работает через Clipboard API с fallback;
- контент виден без JavaScript (класс `js` на `<html>` включает анимации).

## Доступность

- Скип-ссылка «Перейти к содержимому».
- Все иконки-кнопки имеют подписи, декоративные SVG скрыты от скринридеров.
- Фокус видимый: `:focus-visible` с янтарной обводкой.
- Контраст текста не ниже 4.5:1; мелкие янтарные подписи используют тёмный
  оттенок `#8A5A1E`.
- Учитывается `prefers-reduced-motion`: анимации отключаются.

## Лицензии

- **Golos Text**, **JetBrains Mono** — SIL Open Font License 1.1,
  сабсеты скачаны с Google Fonts и лежат локально (`tools/fetch_fonts.py`).
- **Скриншоты** — из приложения [meow meow записи](https://github.com/kidjinbruh-del/meow-meow-zapisi),
  используются как часть проекта.
- Код лендинга — MIT, как и приложение.
