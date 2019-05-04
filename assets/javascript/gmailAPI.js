      
      // Our Credentials
      // we need to create two sets of credentials: a browser API key and an OAuth client ID.
      var clientId = '796714123214-c2l83ece577rjvsfq1frveos1buijo1u.apps.googleusercontent.com';
      var apiKey = 'AIzaSyBjIPFf-EIox8cC0cXAnDwbZFOy_w2M_RQ';

      // These two scopes are all we need to read and send an email
      var scopes =
        'https://www.googleapis.com/auth/gmail.readonly '+
        'https://www.googleapis.com/auth/gmail.send';

        // handleClientLoad() which will automatically be called once Google’s JavaScript client library has loaded into the page
        // handleClientLoad() simply sets the API key and passes off to checkAuth()
      function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth, 1);
      }

      // checkAuth() checks if the user has previously authenticated our app with Google.
      function checkAuth() {
          gapi.auth.authorize({
              client_id: clientId,
              scope: scopes,
              immediate: true
            }, handleAuthResult);
        }
        
        // handleAuthClick() simply executes the same authentication function as checkAuth() 
        // but will present the user with a login/permissions modal.
        function handleAuthClick() {
            gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate: false
            }, handleAuthResult);
            return false;
        }
        
        // handleAuthResult() then does one of two things:
        // if the user is already authenticated it’ll load the Gmail API using loadGmailApi().
        //  alternatively it’ll display the authorize button on the UI and attach a click event to it which will trigger handleAuthClick()
      function handleAuthResult(authResult) {
        if(authResult && !authResult.error) {
          loadGmailApi();
          $('#authorize-button').remove();
          $('.table-inbox').removeClass("hidden");
          $('#compose-button').removeClass("hidden");
        } else {
          $('#authorize-button').removeClass("hidden");
          $('#authorize-button').on('click', function(){
            handleAuthClick();
          });
        }
      }

      // This function loads the Gmail API functionality from Google’s JavaScript client library 
      // and then calls our displayInbox() function.
      function loadGmailApi() {
        gapi.client.load('gmail', 'v1', displayInbox);
      }

      // This will return a JSON object containing the ids of the last ten messages received by the authenticated user
      function displayInbox() {
        var request = gapi.client.gmail.users.messages.list({
          'userId': 'me',
          'labelIds': 'INBOX',
          'maxResults': 10
        });

        //  loop through each message and request more data specific to that message
        // call the User.messages: get endpoint to fetch a single message by it’s id, 
        // and pass the response over to another function, appendMessageRow().
        request.execute(function(response) {
          $.each(response.messages, function() {
            var messageRequest = gapi.client.gmail.users.messages.get({
              'userId': 'me',
              'id': this.id
            });
            messageRequest.execute(appendMessageRow);
          });
        });
      }

      //  append() function to append rows containing the message data to the HTML table
      // making use of Bootstrap’s modal functionality to launch a pre-defined modal window when the link is clicked.
      // UNFORTUNATELY, we don't want to show our emails. This feature will not appear. 
      function appendMessageRow(message) {
        $('.table-inbox tbody').append(
          '<tr>\
            <td>'+getHeader(message.payload.headers, 'From')+'</td>\
            <td>\
              <a href="#message-modal-' + message.id +
                '" data-toggle="modal" id="message-link-' + message.id+'">' +
                getHeader(message.payload.headers, 'Subject') +
              '</a>\
            </td>\
            <td>'+getHeader(message.payload.headers, 'Date')+'</td>\
          </tr>'
        );
        var reply_to = (getHeader(message.payload.headers, 'Reply-to') !== '' ?
          getHeader(message.payload.headers, 'Reply-to') :
          getHeader(message.payload.headers, 'From')).replace(/\"/g, '&quot;');

        var reply_subject = 'Re: '+getHeader(message.payload.headers, 'Subject').replace(/\"/g, '&quot;');
        $('body').append(
          '<div class="modal fade" id="message-modal-' + message.id +
              '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
            <div class="modal-dialog modal-lg">\
              <div class="modal-content">\
                <div class="modal-header">\
                  <button type="button"\
                          class="close"\
                          data-dismiss="modal"\
                          aria-label="Close">\
                    <span aria-hidden="true">&times;</span></button>\
                  <h4 class="modal-title" id="myModalLabel">' +
                    getHeader(message.payload.headers, 'Subject') +
                  '</h4>\
                </div>\
                <div class="modal-body">\
                  <iframe id="message-iframe-'+message.id+'" srcdoc="<p>Loading...</p>">\
                  </iframe>\
                </div>\
                <div class="modal-footer">\
                  <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                  <button type="button" class="btn btn-primary reply-button" data-dismiss="modal" data-toggle="modal" data-target="#reply-modal"\
                  onclick="fillInReply(\
                    \''+reply_to+'\', \
                    \''+reply_subject+'\', \
                    \''+getHeader(message.payload.headers, 'Message-ID')+'\'\
                    );"\
                  >Reply</button>\
                </div>\
              </div>\
            </div>\
          </div>'
        );
        $('#message-link-'+message.id).on('click', function(){
          var ifrm = $('#message-iframe-'+message.id)[0].contentWindow.document;
          $('body', ifrm).html(getBody(message.payload));
        });
      }

      // The first thing we do when sendEmail() is called is disable the send button.
      // It’s important to disable the form submit functionality whenever submission logic is carried out via Ajax, 
      // as this prevents the user from re-clicking the button whilst a request is in progress.
      function sendEmail()
      {
        $('#send-button').addClass('disabled');

        // grab the values from our compose form and hand everything to sendMessage()
        sendMessage(
          {
            'To': $('#compose-to').val(),
            'Subject': $('#compose-subject').val()
          },
          $('#compose-message').val(),
          composeTidy
        );

        //  Returning false from an onsubmit function is important when processing the form via Ajax 
        // — it prevents the form from submitting and reloading the page.
        return false;
      }

      // this funciton simply hides the compose modal, clears the input fields and then re-enables the Send button.
      function composeTidy()
      {
        // $('#compose-modal').modal('hide');

        $('#compose-to').val('');
        $('#compose-subject').val('');
        $('#compose-message').val('');

        $('#send-button').removeClass('disabled');
      }

      function sendReply()
      {
        $('#reply-button').addClass('disabled');

        sendMessage(
          {
            'To': $('#reply-to').val(),
            'Subject': $('#reply-subject').val(),
            'In-Reply-To': $('#reply-message-id').val()
          },
          $('#reply-message').val(),
          replyTidy
        );

        return false;
      }

      function replyTidy()
      {
        // $('#reply-modal').modal('hide');

        $('#reply-message').val('');

        $('#reply-button').removeClass('disabled');
      }

      function fillInReply(to, subject, message_id)
      {
        $('#reply-to').val(to);
        $('#reply-subject').val(subject);
        $('#reply-message-id').val(message_id);
      }

      // This function is where we interact with the Gmail API. 
      // It accepts an object of email headers, the email body and a callback function.
      function sendMessage(headers_obj, message, callback)
      {
        var email = '';

        for(var header in headers_obj)
          email += header += ": "+headers_obj[header]+"\r\n";

        email += "\r\n" + message;

        //  Note that the email message needs to be base-64 encoded, we use window.btoa() for this.
        // Also note that Google’s base-64 implementation differs from what window.btoa() and window.atob() provide 
        // – so we need to carry out some character replacements after the encoding. Specifically we must replace + with - and / with _.
        var sendRequest = gapi.client.gmail.users.messages.send({
          'userId': 'me',
          'resource': {
            'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
          }
        });

        return sendRequest.execute(callback);
      }


      // getBody(), getHeader() and getHTMLPart() are utility functions we’ve defined to abstract out some of the nuances 
      // from working with the Gmail API message resource,  which returns multi-part emails in an inconsistent format (nested parts),
      // along with a message body which is base64 and UTF-8 encoded.
      function getHeader(headers, index) {
        var header = '';
        $.each(headers, function(){
          if(this.name.toLowerCase() === index.toLowerCase()){
            header = this.value;
          }
        });
        return header;
      }

      function getBody(message) {
        var encodedBody = '';
        if(typeof message.parts === 'undefined')
        {
          encodedBody = message.body.data;
        }
        else
        {
          encodedBody = getHTMLPart(message.parts);
        }
        encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
        return decodeURIComponent(escape(window.atob(encodedBody)));
      }

      function getHTMLPart(arr) {
        for(var x = 0; x <= arr.length; x++)
        {
          if(typeof arr[x].parts === 'undefined')
          {
            if(arr[x].mimeType === 'text/html')
            {
              return arr[x].body.data;
            }
          }
          else
          {
            return getHTMLPart(arr[x].parts);
          }
        }
        return '';
      }