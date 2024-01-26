const Ajv = require("ajv");
const ajv = new Ajv();

/* Keyword isNotEmpty is added in ajv 
to validate the empty string for string type*/
ajv.addKeyword({
  keyword: "isNotEmpty",
  validate: (isNotEmpty, data) => {
    if (isNotEmpty) {
      return typeof data === "string" && data.trim() !== "";
    } else return true;
  },
});

const validation = (type, data) => {
  // Schema for the payload validation
  let schema;
  if (type == "create") {
    schema = {
      type: "object",
      properties: {
        description: {
          type: "string",
          isNotEmpty: true,
        },
      },
      required: ["description"],
      additionalProperties: false,
    };
  }
  if (type == "info") {
    schema = {
      type: "object",
      properties: {
        id: {
          type: "string",
          isNotEmpty: true,
        },
        description: {
          type: "string",
          isNotEmpty: true,
        },
      },
      required: ["id", "description"],
      additionalProperties: false,
    };
  }
  if (type == "status") {
    schema = {
      type: "object",
      properties: {
        id: {
          type: "string",
          isNotEmpty: true,
        },
        status: {
          type: "string",
          isNotEmpty: true,
        },
      },
      required: ["id", "status"],
      additionalProperties: false,
    };
  }
  if (type == "remove") {
    schema = {
      type: "object",
      properties: {
        id: {
          type: "string",
          isNotEmpty: true,
        },
        isActive: {
          type: "boolean",
        },
      },
      required: ["id", "isActive"],
      additionalProperties: false,
    };
  }

  // Validates the payload with the defined schema
  const validate = ajv.compile(schema);
  const valid = validate(data);

  // Returns error if the validation fails
  if (!valid) {
    let errors = [];
    validate.errors.forEach((e) => {
      errors.push({
        errorType: e.keyword,
        message: `${e.instancePath} ${e.message} `,
      });
    });
    return { errors };
  }
};

module.exports = validation;
