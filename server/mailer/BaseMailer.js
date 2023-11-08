import { SES } from '@aws-sdk/client-ses'

export default class BaseMailer {
  constructor({ to, from }) {
    this.to = to
    this.from = from
  }

  sendMail() {
    return this.mailService.sendEmail(this.emailParams)
  }

  get mailService() {
    return new SES({ apiVersion: '2010-12-01', region: 'us-east-1' })
  }

  get emailParams() {
    return {
      Destination: {
        ToAddresses: this.to,
      },
      Source: this.from,
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: this.body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: this.subject,
        },
      },
    }
  }
}
