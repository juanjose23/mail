document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  toggle_view('#compose-view');
  clear_fields(['#compose-recipients', '#compose-subject', '#compose-body']);
}

function toggle_view(viewSelector) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector(viewSelector).style.display = 'block';
}

function clear_fields(fields) {
  fields.forEach(field => document.querySelector(field).value = '');
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function send_email() {
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  if (!recipients) {
    display_message('Please enter one or more email addresses.', 'red');
    return;
  }

  const recipientList = recipients.split(", ").map(email => email.trim());
  if (!recipientList.every(validateEmail)) {
    display_message('Please enter valid email addresses separated by ", "', 'red');
    return;
  }

  let errors = 0; 
  let emailsProcessed = 0; 
  const totalEmails = recipientList.length; 

  recipientList.forEach(email => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({ recipients: email, subject, body })
    })
      .then(response => response.json())
      .then(result => {
        emailsProcessed++; // Incrementa contador de emails procesados
        if (result.error) {
          errors++;
          display_message(`User with ${email} does NOT exist`, 'red');
        }

        // Si ya se han procesado todos los correos
        if (emailsProcessed === totalEmails) {
          if (errors === 0) {
            display_message('Email sent successfully!', 'green');
            load_mailbox('sent');
          }
        }
      });
  });
}


function display_message(message, color) {
  const messageElement = document.querySelector('#message');
  messageElement.innerHTML = message;
  messageElement.style.color = color;
}

function load_mailbox(mailbox) {
  toggle_view('#emails-view');
  const email_view = document.querySelector('#emails-view');
  email_view.innerHTML = `<h3>${capitalize(mailbox)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      if (emails.length === 0) {
        email_view.innerHTML += '<p style="font-size: large; font-weight: bold;">Nothing to see here :(</p>';
      } else {
        emails.forEach(email => create_email_entry(email, email_view));
      }
    });
}

function create_email_entry(email, parentElement) {
  const mail = document.createElement('div');
  mail.classList.add('container', 'mail', 'border', 'p-2');
  mail.style.backgroundColor = email.read ? 'lightgray' : 'white';

  mail.innerHTML = `
    <h5 class="d-inline-block m-1">${email.sender}</h5>
    <p class="d-inline-block m-1 ${email.subject ? '' : 'text-danger'}">${email.subject || 'No Subject'}</p>
    <p class="d-inline-block m-1 text-blue" style="float: right;">${email.timestamp}</p>
    <p style="display: none;">${email.id}</p>
  `;

  mail.addEventListener('click', () => load_email(email.id));

  parentElement.appendChild(mail);
}

function load_email(id) {
  toggle_view('#email-view');
  const mail_view = document.querySelector('#email-view');
  mail_view.innerHTML = '';

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      const emailDetails = `
        <div class="container jumbotron">
          <h3>${email.subject}</h3>
          <h5>From: ${email.sender}</h5>
          <p class="text-blue">${email.timestamp}</p>
        </div>
        <div class="container p-2 bg-lightgray">${email.body}</div>
      `;
      mail_view.innerHTML = emailDetails;

      if (!email.read) mark_as_read(id);

      const btn = document.createElement('button');
      btn.innerText = email.archived ? 'Unarchive' : 'Archive';
      btn.classList.add('btn', 'btn-primary');
      btn.addEventListener('click', () => toggle_archive(id, email.archived));

      const replyBtn = document.createElement('button');
      replyBtn.innerText = 'Reply';
      replyBtn.classList.add('btn', 'btn-primary');
      replyBtn.addEventListener('click', () => reply_to_email(email));

      mail_view.appendChild(btn);
      mail_view.appendChild(replyBtn);
    });
}

function mark_as_read(id) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ read: true })
  });
}

function toggle_archive(id, archive) {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ archived: !archive })
  })
    .then(() => load_mailbox('inbox'));
}

function reply_to_email(email) {
  compose_email();
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote: ${email.body}`;
  document.querySelector('#compose-subject').value = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
