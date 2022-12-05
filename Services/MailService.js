import nodemailer from 'nodemailer'


class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: 'alexmalahoff4@gmail.com',
        pass: 'lrwdjqzpkljbmpxz', 
      }
    })
  }

  async sendActivationMail(to,link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта dominos',
      text: '',
      html: 
        `
          <div>
            <h1>Для активации перейдите по лінку та авторизуйтесь на сайті</h1>
            <a href="${process.env.BACKEND_URL}/user/activate/${link}">Лінк для активації</a>
          </div>
        `
    })
  }
}

export default new MailService()