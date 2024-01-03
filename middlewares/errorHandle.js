// not Found 
const notFound = (req, res) => { 
    const error = new Error(`Not found : ${req.originalUrl}`)
    res.status(404)
    next(error)
 };

// Error Handle
const errorHandle = (err, req, res, next ) => { 
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;;
    res.status(statuscode)
    res.json({
        message: err?.message,
        stack:err?.stack,
    })
 }

module.exports = {errorHandle, notFound}