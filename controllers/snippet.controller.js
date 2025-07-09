const express = require('express');
const Snippet = require('../models/snippet.model');

//#region create new snippet
/**
 * Create new snippet.
 * @param {express.Request} req - The Express request object containing snippet input in `req.body`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const create = async(req, res) => {
    const userId = req['user']._id;
    const { title, language, code, description } = req.body;

    const snippet = await Snippet.create({
        title,
        language,
        code,
        description,
        createdBy: userId
    });

    return res.status(201).json({
        success: true,
        message: 'Snippet has been added successfully',
        data: {
            snippet
        }
    });
}
//#endregion

//#region update snippet
/**
 * update snippet.
 * @param {express.Request} req - The Express request object containing snippet input in `req`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const update = async(req, res) => {
    const userId = req['user']._id;
    const id = req.params.id;
    const { title, language, code, description } = req.body;

    const snippet = await Snippet.findById(id);

    if (!snippet.createdBy.equals(userId)) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            errors: ['You are not allowed to modify this snippet']
        });
    }
    
    snippet.title = title;
    snippet.language = language;
    snippet.code = code;
    snippet.description = description;

    await snippet.save();

    return res.status(200).json({
        success: true,
        message: 'Snippet has been updated successfully',
        data: null
    });
}
//#endregion

//#region remove snippet
/**
 * delete snippet.
 * @param {express.Request} req - The Express request object containing snippet input in `req`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const remove = async(req, res) => {
    const userId = req['user']._id;
    const id = req.params.id;

    const snippet = await Snippet.findById(id);

    if (!snippet.createdBy.equals(userId)) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            errors: ['You are not allowed to modify this snippet']
        });
    }

    await snippet.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Snippet has been deleted successfully',
        data: null
    });
}
//#endregion

//#region get one snippet
/**
 * get one snippet.
 * @param {express.Request} req - The Express request object containing snippet input in `req`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const getOne = async(req, res) => {
    const id = req.params.id;

    const snippet = await Snippet.findById(id);

    return res.status(200).json({
        success: true,
        message: '',
        data: { snippet }
    });
}
//#endregion

//#region get many snippet
/**
 * get snippets.
 * @param {express.Request} req - The Express request object containing snippet input in `req`.
 * @param {express.Response} res - The Express response object used to return status and data.
 * @returns {void}
 */
const getMany = async(req, res) => {
    let { title, language, createdByName, page = '1', perPage = '10' } = req.query;
    page = +page;
    perPage = +perPage;

    const matchStage = {};
    if (title) matchStage.title = { $regex: title, $options: 'i' };
    if (language) matchStage.language = { $regex: language, $options: 'i' };

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' }
    ];

    if (createdByName) {
      pipeline.push({
        $match: { 'creator.name': { $regex: createdByName, $options: 'i' } }
      });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const dataPipeline = [
      ...pipeline,
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
      {
        $project: {
          title: 1,
          language: 1,
          createdAt: 1,
          creator: { _id: 1, name: 1 }
        }
      }
    ];

    const [snippets, countResult] = await Promise.all([
      Snippet.aggregate(dataPipeline),
      Snippet.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      message: '',
      data: {
        pageInfo: {
          totalItems: total,
          totalPages: Math.ceil(total / perPage),
          currentPage: page
        },
        snippets
      }
    });
}
//#endregion

module.exports = { create, update, remove, getOne, getMany };