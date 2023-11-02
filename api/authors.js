const { author } = require('../prisma');

const router = require('express').Router();
module.exports = router;

router.get('/', async(req,res,next) => {
    try {
        const authors = await prisma.author.findMany();
        res.json(authors);
    } catch {
        next();
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            const error = { 
                status: 400,
                message: 'Author must have a name.'
            };
            return next(error);
        }
        const author = await prisma.author.create({data: { name } });
        res.json(author);
    } catch {
        next();
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id= +req.params.id;
        const author = await prisma.author.findUnique({ where: { id } });
        if (!author) {
            return next ({
                status: 404,
                message: `Could not find author with id ${id}.`,
            });
        }
        res.json(author);
    } catch {
        next();
    }
});

router.pput('/:id', async (req, res, next) => {
    try { 
        const id = +req.params.id;
        const authorExists = await prisma.author.findUnique({ where: {id} });
        if (!authorExists) {
            return next ({
                status:400,
                message: 'Author must have a name.',
            });
        }
        const author = await prisma.author.update({
            where: { id },
            data: { name },
        });
        res.json(author);
    } catch {
        next();
    }
});


router.delete('/:id', async (req, res, next) => {
    try {
        const id= +req.params.id;
        const authorExists = await prisma.author.findUnique({ where: { id } });
        if (!authorExists) {
            return next({
                status: 404,
                message: `Could not find author with id ${id}.`,
            });
        }
        await prisma.author.delete({ where: { id } });
        res.sendStatus(204);
    } catch {
        next();
    }
});

router.get('/:id/books', async (req, res, next) => {
    try{
        const id= +req.params.id;
        const author = await prisma.author.findUnique({ where: { id } });
        if (!author) {
            return next({
                status: 404,
                message: `Could not find author with id ${id}`,
            });
        }
        const books = await prisma.book.findMany({where: { authorId: id } });
        res.json(books);
    } catch {
        next();
    }
});

router.post('/:id/books', async (req, res, next) => {
    try {
        const id= +req.params.id;
        const author = await prisma.author.findUnique({ where: { id }});
        if (!author) {
            return next ({
                status: 404,
                message: `Could not find author with id ${id}`,
            });
        }
        const { title } = req.body;
        if (!title) {
            return next({
                status: 400,
                message: 'Book must have a title.',
            });
        }
        const book = await prisma.book.create({
            data: { title, author:{ connect: { id }}},
        });
        res.json(book);
    } catch {
        next();
    }
});