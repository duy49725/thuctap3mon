import nodemailer from 'nodemailer';

const Email = (options: {from: string, to: string, subject: string, html: string}) => {
    let transpoter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'duy49725@gmail.com',
          pass: 'izlqmoxhcquoruot', 
        },
      });
      transpoter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          return;
        }
      });
};

const EmailSender = ({fullName, email, phone, message}: {fullName: string, email: string, phone: string, message: string}) => {
    console.log({fullName, email, phone, message});
    const options = {
        from: `duy49725@gmail.com`,
        to: 'trannhat111203@gmail.com',
        subject: 'Message From Fruit Store',
        html: `
            <div style="width: 100%; background-color: #f3f9ff; padding: 5rem 0">
            <div style="max-width: 700px; background-color: white; margin: 0 auto">
              <div style="width: 100%; background-color: gray; padding: 20px 0">
              <a href="#" ><img
                  src="https://th.bing.com/th/id/R.de38b2be4d0f21252a8d5201e0152549?rik=KP8TWIVPCDGVOQ&riu=http%3a%2f%2fwww.clker.com%2fcliparts%2fe%2fa%2fb%2f3%2f127709671448235570book.png&ehk=ifWZQE73vKu2jgw%2fXsMhYx0fOPGVQmUg2APGa34vOI4%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
                  style="width: 100%; height: 70px; object-fit: contain"
                /></a> 
              
              </div>
              <div style="width: 100%; gap: 10px; padding: 30px 0; display: grid">
                <p style="font-weight: 800; font-size: 1.2rem; padding: 0 30px">
                  Form Shoeshop Store
                </p>
                <div style="font-size: .8rem; margin: 0 30px">
                  <p>FullName: <b>${fullName}</b></p>
                  <p>Email: <b>${email}</b></p>
                  <p>Phone: <b>${phone}</b></p>
                  <p>Message: <i>${message}</i></p>
                </div>
              </div>
            </div>
          </div>
            `,
    };
    Email(options);
}

export default EmailSender;