function requestMiddleware(req, res, next) {
    const chunks = [];

    res.write = ((oldWrite) => function (chunk) {
        chunks.push(chunk);
        oldWrite.call(this, chunk);
    })(res.write);

    res.end = ((oldEnd) => function (chunk) {
        if (chunk) {
            chunks.push(chunk);
        }

        const responseBody = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        console.log('Response body >>>>>', responseBody);

        oldEnd.call(this, chunk);
    })(res.end);

    console.log(`Request type >>>>> ${req.method} ${req.url}`);
    if (req.body) {
        console.log('Request body >>>>>', req.body);
    }

    next();
}

module.exports = requestMiddleware;
