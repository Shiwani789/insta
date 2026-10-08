"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Use parsed/defaulted/transformed values downstream (including
            // compatibility transforms such as mediaUrls -> media).
            if (parsed && typeof parsed === 'object' && 'body' in parsed) {
                req.body = parsed.body;
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    error: {
                        code: 'VALIDATION_ERROR',
                        details: error.issues,
                    },
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
