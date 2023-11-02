const router = require('express').Router();
module.exports = router;

const prisma = require('../prisma');

router.get('/', async (req, res, next) => {
    try {
        const books= await prisma.book.findMany();
        res.json(books);
    } catch {
        next();
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = +req.params.id;
        const book = await prisma.book.findUnique({ where: { id } });
        if (!book) {
            return next({
                status: 404,
                message: `Could not find book with id ${id}.`,
            });
        }
        res.json(book);
    } catch {
        next();
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id= +req.params.id;
        const bookExists = await prisma.book.findUnique({ where: { id } });
        if (!bookExists) {
            return next ({
                status: 404, 
                message: `Could not find book with id ${id}`,
            });
        }
        const { title } = req.body;
        if (!title) {
            return next ({
                status: 400,
                message: 'Book must have a title.',
            });
        }
        const book = await prisma.book.update ({
            where: { id },
            data: { title },
        });
        res.json(book);
    } catch {
        next();
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = +req.params.id;
        const bookExists = await prisma.book.findUnique({ where: { id } });
        if (!bookExists) {
            return next({
                status: 404,
                message: `Could not find book with id ${id}`,
            });
        }
        await prisma.book.delete({ where: { id } });
        res.sendStatus(204);
    } catch {
        next();
    }
})