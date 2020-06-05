const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.locals.msg = '';
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/send', (req, res) => {
  let output = `
    <h1>New Email!</h1>
     <ul>
       <li>Name: ${req.body.name}</li>
       <li>Email: ${req.body.email}</li>
       <li>Subject: ${req.body.subject}</li>
       <li>Message: ${req.body.message}</li>
     </ul>
  `;

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'seu host smtp',
    port: 587,
    secure: false,
    auth: {
        user: 'seu email',
        pass: 'sua senha app'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = { 
      from: 'Remetente', // sender address
      to: 'Destinario', // list of receivers
      subject: 'Menssagem', // Subject line
      message: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info,res) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
});

server.listen(port, () => console.log(`App running on port ${port}`));
