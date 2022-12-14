const DocumentsModel = require("../models/documents");

module.exports = {
  list: function (req, res) {
    DocumentsModel.find(function (err, documents) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting documents.",
          error: err,
        });
      }

      return res.json(documents);
    });
  },
  search: function (req, res) {
    const { title } = req.query;
    DocumentsModel.find({ $text: { $search: title } }, function (err, documents) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting documents.",
          error: err,
        });
      }

      return res.json(documents);
    });
  },
  show: function (req, res) {
    const { id } = req.params;

    DocumentsModel.findById(id, function (err, document) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting document.",
          error: err,
        });
      }

      if (!document) {
        return res.status(404).json({
          message: "No such document",
        });
      }

      return res.json(document);
    });
  },
  getByUserId: function (req, res) {
    const { id } = req.params;

    DocumentsModel.find({ userId: id }, function (err, document) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting document.",
          error: err,
        });
      }

      if (!document) {
        return res.status(404).json({
          message: "No such document",
        });
      }

      return res.json(document);
    });
  },
  create: function (req, res) {
    const { title, userId, language = 'en' } = req.body;
    const languageTag = {
      'en': `<english>${title}</english>`,
      'de': `<german>${title}</german>`,
    };

    const documents = new DocumentsModel({ title: languageTag[language], userId });

    documents.save(function (err, document) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating document",
          error: err,
        });
      }

      return res.status(201).json(document);
    });
  },
  update: function (req, res) {
    const { id } = req.params;

    DocumentsModel.findOne({ _id: id }, function (err, document) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting document",
          error: err,
        });
      }

      if (!document) {
        return res.status(404).json({
          message: "No such document",
        });
      }
      const { title } = req.body;
      document.title = title;
      document.updatedAt = new Date();

      document.save(function (err, document) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating document.",
            error: err,
          });
        }

        return res.json(document);
      });
    });
  },
  remove: function (req, res) {
    const { id } = req.params;

    DocumentsModel.findByIdAndRemove(id, function (err, documents) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the documents.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
