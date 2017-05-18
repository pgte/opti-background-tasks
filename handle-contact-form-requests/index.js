'use strict'

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('vkQMjO0n9Nmp0po8QnPcaA');

var defaultEmails = {
  'optihousing.com': 'english@opti.pt',
  'opti.pt': 'contact@opti.pt'
}

var affiliates = {
  default: 'contact@opti.pt',
  madeira: 'madeira@opti.pt'
}

exports.handle = function (event, callback) {
  var data = event.data.data
  // JSON.parse((new Buffer(event.data, 'base64')).toString())
  data = JSON.parse(JSON.parse((new Buffer(data, 'base64')).toString()))
  console.log('%j', data)

  var text = [
    'Nome: ' + data.name,
    'Telefone: ' + data.phone,
    'Email: ' + data.email,
    'Mensagem: ' + data.message,
    'Origin: ' + data.origin
  ]

  var to = data.affiliate && affiliates[data.affiliate] ? affiliates[data.affiliate] : defaultEmails[data.origin || 'opti.pt']

  var message = {
      "html": text.map(toParagraph).join('\n').replace(/\n/g, '<br>\n'),
      "text": text.join('\n'),
      "subject": "OPTi Houses: Pedido de contacto",
      "from_email": "info@opti.pt",
      "from_name": "OPTi Houses",
      "to": [
        {
          "email": to,
          "name": "OPTi Houses Contact from " + (data.origin || 'opti.pt'),
          "type": "to"
        }
      ],
      "headers": {
        "Reply-To": data.email
      }
  }

  mandrill_client.messages.send(
    {message: message},
    function(result) {
      console.log(result);
      callback()
    },
    function(e) {
      console.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      callback(err)
    }
  );
}

function toParagraph (line) {
  return ['<p>', line, '</p>'].join('')
}