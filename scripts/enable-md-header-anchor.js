const anchor = require('markdown-it-anchor');
const md = require('markdown-it')();

hexo.extend.filter.register('markdown-it:renderer', md => {
    md.use(anchor, {
        permalink: anchor.permalink.headerLink()
    })
});