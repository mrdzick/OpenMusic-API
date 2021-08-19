const Joi = require('joi')

const ImageHeadersSchema = Joi.object({
    'content-type': Joi.string().valid('image/avif', 'image/bmp', 'image/gif', 'image/jpeg', 'image/png', 'image/tiff', 'image/webp').required()
}).unknown()

module.exports = { ImageHeadersSchema }
