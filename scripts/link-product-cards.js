const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const target = 'chi-tiet-san-pham.html';
const files = ['index.html', 'tay-trang-bioelements.html', 'chi-tiet-san-pham.html'];

// Wrap the product image(s) inside the media block with a link, keeping
// badge / wishlist as siblings. Matches one or two product-card__image tags.
const mediaRe = /(<div class="product-card__media">\s*)((?:<img class="product-card__image"[^>]*>\s*)(?:<img class="product-card__image product-card__image--hover"[^>]*>\s*)?)/g;

// Convert the product name heading into a link.
const nameRe = /<h3 class="product-card__name">([\s\S]*?)<\/h3>/g;

files.forEach(function (file) {
    const p = path.join(root, file);
    let html = fs.readFileSync(p, 'utf8');
    let mediaCount = 0;
    let nameCount = 0;

    html = html.replace(mediaRe, function (match, open, imgs) {
        if (/product-card__media-link/.test(match)) return match;
        mediaCount++;
        return open + '<a class="product-card__media-link" href="' + target + '">\n                                    '
            + imgs.trim()
            + '\n                                </a>\n                                ';
    });

    html = html.replace(nameRe, function (match, inner) {
        nameCount++;
        return '<a class="product-card__name" href="' + target + '">' + inner + '</a>';
    });

    fs.writeFileSync(p, html, 'utf8');
    console.log(file, '- media links:', mediaCount, ', name links:', nameCount);
});
