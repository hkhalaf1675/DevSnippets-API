const express = require('express');
const { validation } = require('../utils/validation');
const router = express.Router();
const snippetController = require('../controllers/snippet.controller');
const { authGuard } = require('../middlewares/auth.guard');

router.use(authGuard);

router.post('/create',
    validation({
        title: 'required|string',
        language: 'required|string',
        code: 'required|string',
        description: 'required|string',
    }, 'body'),
    snippetController.create
);

router.put('/:id/update',
    validation({
        id: 'required|existsSnippet'
    }, 'params'),
    validation({
        title: 'string',
        language: 'string',
        code: 'string',
        description: 'string',
    }, 'body'),
    snippetController.update
);

router.delete('/:id/delete',
    validation({
        id: 'required|existsSnippet'
    }, 'params'),
    snippetController.remove
);

router.get('/:id',
    validation({
        id: 'required|existsSnippet'
    }, 'params'),
    snippetController.getOne
);

router.get('/',
    snippetController.getMany
);

module.exports = router;