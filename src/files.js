import formidable from "formidable";

const files = db => {
  const api = {};

  api.upload = async (req, res) => {
    try {
      var form = new formidable.IncomingForm();
      form.uploadDir = "./uploads";
      form.on("progress", function(recv, total) {
        if (total > 30 * 1024 * 1024) {
          throw new Error("file too large");
        }
      });
      form.on("file", function(name, file) {
        // if you need to process uploading files one by one, you can do it here
        // and do nothing in the form.parse  callback function
      });
      form.parse(req, (err, fields, files) => {
        res.status(200).end();
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  return api;
};

export default files;
