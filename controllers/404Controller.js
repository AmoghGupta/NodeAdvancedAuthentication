

const notFound404 = (req, res, next)=>{
    res.status(404).render('404', {pageTitle: 'Page not found'});
}


exports.notFound404 = notFound404;