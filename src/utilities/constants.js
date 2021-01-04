import config from '../config'
// the sql common options to use
exports.mongoSchemaOptions = {
  timestamps: { createdAt: 'added_on', updatedAt: 'updated_on' },
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}

exports.err = {
  200: {
    type: 'success',
    code: 200,
    status: 'ok',
    message: 'The request has succeeded.'
  },
  204: {
    type: 'success',
    code: 204,
    status: 'No Content',
    message: 'No response body to send.'
  },
  400: {
    type: 'error',
    code: 400,
    status: 'Bad Request',
  },
  401: {
    type: 'error',
    code: 401,
    status: 'Unauthorized',
    message: 'Authentication credentials are missing or invalid.'
  },
  403: {
    type: 'error',
    code: 403,
    status: 'Forbidden',
    message: 'The server understood the request but refuses to authorize it.'
  },
  404: {
    type: 'error',
    code: 404,
    status: 'Not Found',
    message: 'The requested URL or Resource is not found.'
  },
  405: {
    type: 'error',
    code: 405,
    status: 'Method Not Allowed',
    message: 'The requested method is not allowed.'
  },
  406: {
    type: 'error',
    code: 406,
    status: 'Not Acceptable',
    message: 'The request has missing file.'
  },
  415: {
    type: 'error',
    code: 415,
    status: 'Unsupported Media Type',
    message: 'The supported media types are JPG,JPEG,PNG.'
  },
  500: {
    type: 'error',
    code: 500,
    status: 'Internal Server Error',
    message: 'The server encountered an unexpected condition that prevented it from fulfilling the request.'
  }
};

exports.rules = {
  email: {
    type: 'regex',
    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  },
  // password: {
  //   type: 'func',
  //   method: '_password'
  // },
  alphabet: {
    type: 'regex',
    regex: /^[a-zA-Z ]+$/
  },
  alphanumeric: {
    type: 'regex',
    regex: /^[a-zA-Z0-9]/
  },
  url: {
    type: 'regex',
    regex: /^(https?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/
  },
  numeric: {
    type: 'regex',
    regex: /^[0-9]+$/
  }
}

exports.populate = {
  createdBy: {
    path: 'created_by',
    select: 'u_id id first_name middle_name last_name'
  },
  challenge: {
    path: 'challenge',
    select: 'tags id name description cover_picture caption rules'
  },
  participants: {
    path: 'participants',
    select: 'u_id id first_name middle_name last_name'
  }
}

exports.emailTemplate = {
  verifyToken: {
    from: '{from}', // Sender address
    to: '{to}',         // List of recipients
    subject: 'Email Verification for EtonBikes', // Subject line
    html: `<p>Day Greetings</p>
    <p>From Eton,</p>
    <p><br></p>
    <p>Please click on given link for verify your email with us.</p>
    <p>{link}</p>
    <p><strong>Note</strong>: This link is valid for 24 hours only. Please re generate the link if its expired.</p>
    <p><br></p>
    <p>Thanks &amp; Regards,</p>
    <p>Eton Team.</p>
    <p><br></p>`
  },
  CapturedPayment: {
    from: '{from}', // Sender address
    to: '{to}',         // List of recipients
    subject: 'Payment received from EtonBikes', // Subject line
    html: `<p>Day Greetings</p>
    <p>from Eton Bikes,</p>
    <p><br></p>
    <p><br></p>
    <p>Thank you so much {userName} for booking a bike from our end. We will try to make it smooth by sending this as earliest as possible.</p>
    <p>Till then If you have any query related our product then you can contact us on below contact details.</p>
    <p><strong><u>Call: +91 8883540000</u></strong></p>
    <p>Thanks &amp; Regards</p>
    <p>Eton Team</p>
    <p>&nbsp;</p>`
  }
}

export function replaceVariables(text, object) {
  text = String(text);
  let variables = Object.entries(object);
  variables.forEach((para) => {
    var find = '{' + para[0] + '}'
    var regExp = new RegExp(find, 'g')
    text = text.replace(regExp, para[1])
  })
  return text;
}
