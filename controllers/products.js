const Product = require("../models/product");


// function to check Authentication
function isAuthenitcatedUsingSession(req,res){
    return new Promise((resolve, reject)=>{
        if(req.session.isLoggedIn){
            resolve("Authenicated");
        }else{
            reject("Not Authorized")
        }
    });
}


// function isAuthenitcatedUsingCookies(req,res){
//     return new Promise((resolve, reject)=>{
//         if(req.cookies['loggedIn']){
//             resolve("Authenicated");
//         }else{
//             reject("Not Authorized")
//         }
//     });
// }

getAddProduct = (req, res, next)=>{
    isAuthenitcatedUsingSession(req,res).then((data)=>{
        res.render('addProduct',
        {
            pageTitle: 'Add Product Page',
            addProductPage: true
        }
        );
    }).catch((err)=>{
        res.status(401).redirect('/login');
    });
    
}



postAddProduct = (req, res, next)=>{
    isAuthenitcatedUsingSession(req,res).then((data)=>{
        const product = new Product(req.body);
        product.save().then((data)=>{
            console.log('saved')
            res.redirect("/");
        }).catch((err)=>{
            console.log(err);
        });
    }).catch((err)=>{
        res.status(401).redirect('/login');
    });

    
}

getProducts = (req, res, next)=>{
    isAuthenitcatedUsingSession(req,res).then((data)=>{
        Product.fetchAll(req.session.user).then((products)=>{
            res.render('shop',
            {
                products:products,
                pageTitle: 'Shop Page',
                shopPage: true
            }
            );
            
        }).catch(()=>{
            res.status(500).send("Something went wrong file fetching data from database");
        })
    }).catch((err)=>{
        res.status(401).redirect('/login');
    });

    
}


getProductDetails = (req, res, next)=>{
    isAuthenitcatedUsingSession(req,res).then((data)=>{
         //reading from URL params
        const prodId = req.params.productId;
        Product.findById(prodId).then((product)=>{
            res.render('product-details',
            {
                product:product,
                pageTitle: 'Product Details Page',
                detailsPage: true
            }
        );
        }).catch((err)=>{
            console.log("ERROR FETCHING DATA: ",err);
        })
    }).catch((err)=>{
        res.status(401).redirect('/login');
    });

   
}

exports.getProducts =getProducts;
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProductDetails =getProductDetails;
exports.isAuthenitcatedUsingSession = isAuthenitcatedUsingSession;